import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { filter, publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Character } from 'types/character';
import { Roll } from 'types/event';

@Component({
  selector: 'player',
  templateUrl: './playerview.component.html',
  styleUrls: ['./playerview.component.scss'],
})
export class PlayerviewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  myCharacters: Observable<Character[]>;
  rolls: Observable<Roll[]>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroyingSubject.next(true);
  }

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
    this.myCharacters = this.campaign.pipe(
      switchMap((campagin) => this.campaignService.usersCharacters(campagin.id))
    );
    this.rolls = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.listRolls(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
  }

  hasRolls(character: Character, rolls: Roll[]) {
    return (
      rolls &&
      rolls.length &&
      rolls.filter(
        (roll) => roll.roller === character.id && roll.state === 'requested'
      ).length
    );
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}

import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Character, SkilledCharacter } from 'types/character';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { CharacterService } from 'src/app/data/character.service';
import { InitiativeService } from 'src/app/actions/initiative/initiative.service';
import { Roll } from 'types/roll';
import { RollService } from 'src/app/rolls/roll.service';

type ActionType = 'initiative' | 'noncombat' | 'reset' | 'rest';
interface Action {
  type: ActionType;
  character?: Character;
  event: MouseEvent;
}

@Component({
  selector: 'framesystem-campaign-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  characters: Observable<Character[]>;
  rolls: Observable<Roll[]>;
  gm: Observable<boolean>;
  destroyingSubject = new BehaviorSubject<boolean>(false);
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  actionSubject = new Subject<Action>();
  action = this.actionSubject
    .asObservable()
    .pipe(distinctUntilChanged(), publishReplay(1), refCount());

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private initiativeService: InitiativeService,
    private rollService: RollService,
    private route: ActivatedRoute,
    private auth: AngularFireAuth
  ) {}

  ngOnDestroy(): void {
    this.destroyingSubject.next(true);
  }

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get({
          campaignId: params.get('campaignId'),
          type: 'campaign',
        })
      ),
      publishReplay(1),
      refCount()
    );
    this.characters = this.campaign.pipe(
      switchMap((campagin) =>
        this.characterService.list(campagin, ['viewer', 'player', 'gm'])
      ),
      publishReplay(1),
      refCount()
    );
    this.gm = combineLatest([this.campaign, this.auth.user]).pipe(
      map(([{ acl }, { uid }]) => acl[uid] === 'gm')
    );

    const actionStream = combineLatest([
      this.campaign,
      this.characters,
      this.action,
    ]).pipe(takeUntil(this.destroying));

    actionStream
      .pipe(filter(([, , event]) => event.type === 'initiative'))
      .subscribe(([campaign, characters]) =>
        this.initiativeService.trigger(characters, campaign)
      );
    actionStream
      .pipe(filter(([, , event]) => event.type === 'rest'))
      .subscribe(([campaign, characters]) => {
        this.characterService.rest(characters);
        this.rollService.scene(campaign);
      });
    actionStream
      .pipe(filter(([, , event]) => event.type === 'reset'))
      .subscribe(([, characters]) => this.characterService.reset(characters));
  }

  initiative(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'initiative' });
  }

  noncombat(event: MouseEvent, character: Character) {
    this.actionSubject.next({ event, character, type: 'noncombat' });
  }

  rest(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'rest' });
  }

  reset(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'reset' });
  }
}

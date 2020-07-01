import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  Character,
  Companion,
  NonplayerCharacter,
  PlayerCharacter,
} from 'src/types/character';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'src/types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Roll } from 'src/types/event';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  campaign: Observable<Campaign>;
  description: Observable<string>;
  name: Observable<string>;
  playerCharacters: Observable<PlayerCharacter[]>;
  nonplayerCharacters: Observable<NonplayerCharacter[]>;
  companions: Observable<Companion[]>;
  myCharacters: Observable<Character[]>;
  allRolls: Observable<Roll[]>;
  rollsNeedingAttention: Observable<Roll[]>;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
    this.name = this.campaign.pipe(map((v) => v.name));
    this.description = this.campaign.pipe(map((v) => v.description));
    this.myCharacters = this.campaign.pipe(
      switchMap((campaign) =>
        this.campaignService.listMyCharacters(campaign.id)
      )
    );

    this.allRolls = this.campaign.pipe(
      switchMap((campaign) => this.campaignService.listRolls(campaign.id)),
      publishReplay(1),
      refCount()
    );

    this.rollsNeedingAttention = combineLatest([
      this.myCharacters,
      this.allRolls,
    ]).pipe(
      map(([characters, rolls]) => ({
        characterIds: characters.map((c) => c.id) as string[],
        rolls: rolls as Roll[],
      })),
      map(({ characterIds, rolls }) =>
        rolls.filter((roll) => characterIds.indexOf(roll.roller) >= 0)
      )
    );

    this.playerCharacters = this.campaign.pipe(
      switchMap((campaign) =>
        this.campaignService.listCharacters(campaign.id, {
          type: 'player',
        } as Partial<PlayerCharacter>)
      )
    );
    this.nonplayerCharacters = this.campaign.pipe(
      switchMap((campaign) =>
        this.campaignService.listCharacters(campaign.id, {
          type: 'nonplayer',
        } as Partial<NonplayerCharacter>)
      )
    );
    this.companions = this.campaign.pipe(
      switchMap((campaign) =>
        this.campaignService.listCharacters(campaign.id, {
          type: 'companion',
        } as Partial<Companion>)
      )
    );
  }
}

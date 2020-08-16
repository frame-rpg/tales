import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  Character,
  Companion,
  NonplayerCharacter,
  PlayerCharacter,
} from 'types/character';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { CharacterService } from 'src/app/data/character.service';
import { Roll } from 'types/event';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  campaign: Observable<Campaign>;
  description: Observable<string>;
  name: Observable<string>;
  characters: Observable<Character[]>;
  rolls: Observable<Roll[]>;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private characterService: CharacterService
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
    this.characters = this.campaign.pipe(
      switchMap(({ id, characters }) =>
        this.campaignService.characters({ id, characters })
      ),
      map((characters) =>
        characters.sort((a, b) => {
          if (a.status?.initiative && b.status?.initiative) {
            return a.status.initiative - b.status.initiative;
          } else if (a.status?.initiative) {
            return -1;
          } else if (b.status?.initiative) {
            return 1;
          } else {
            return a.name.localeCompare(b.name);
          }
        })
      )
    );
    this.rolls = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.listRolls(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}

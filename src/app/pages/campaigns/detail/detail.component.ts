import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map, publishReplay, refCount, switchMap, tap } from 'rxjs/operators';

import { Campaign } from 'src/app/types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Companion } from 'src/app/types/companion';
import { NonplayerCharacter } from 'src/app/types/nonplayer_character';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/app/types/player_character';
import { Scene } from 'src/app/types/scene';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  campaign: Observable<Campaign>;
  description: Observable<string>;
  name: Observable<string>;
  scenes: Observable<Scene[]>;
  playerCharacters: Observable<PlayerCharacter[]>;
  nonplayerCharacters: Observable<NonplayerCharacter[]>;
  companions: Observable<Companion[]>;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute
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
    this.scenes = this.campaign.pipe(
      switchMap((campaign) => this.campaignService.listScenes(campaign.id))
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

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map, publishReplay, refCount, switchMap } from 'rxjs/operators';

import { Campaign } from 'src/types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Companion } from 'src/types/companion';
import { NonplayerCharacter } from 'src/types/nonplayer_character';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';

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

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/components/campaigns/campaign.service';
import { Character } from 'types/character';
import { CharacterService } from 'src/app/components/characters/character.service';
import { Observable } from 'rxjs';
import { User } from 'types/user';

@Component({
  selector: 'framesystem-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit {
  campaign: Observable<Campaign>;
  players: Observable<User[]>;
  characters: Observable<Character[]>;

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private route: ActivatedRoute
  ) {}

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
      switchMap((campagin) => this.characterService.list(campagin)),
      publishReplay(1),
      refCount()
    );
  }
}

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';

import { Campaign } from 'src/app/types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Observable } from 'rxjs';
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

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get(params.get('id'))
      )
    );
    this.name = this.campaign.pipe(map((v) => v.name));
    this.description = this.campaign.pipe(map((v) => v.description));
    this.scenes = this.campaign.pipe(
      switchMap((campaign) => this.campaignService.listScenes(campaign.id))
    );
  }
}

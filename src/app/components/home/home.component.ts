import { Component, Input, OnInit } from '@angular/core';

import { Campaign } from 'types/campaign';

export interface Presentation {
  userId: string;
  campaigns: Campaign[];
}

@Component({
  selector: 'tales-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() presentation: Presentation;

  constructor() {}

  ngOnInit(): void {}

  linkToCampaign(campaign: Campaign) {
    if (campaign.acl[this.presentation.userId] === 'read') {
      return ['campaigns', campaign.campaignId, 'player'];
    } else {
      return ['campaigns', campaign.campaignId, 'gm'];
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/data/campaign.service';
import { Campaign, NewCampaign } from 'src/app/types/campaign';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  list$: Observable<Campaign[]>;
  constructor(private campaignService: CampaignService) {}
  ngOnInit(): void {
    this.list$ = this.campaignService.list();
  }
  createCampaign(name: string, description: string) {
    return this.campaignService.create({ name, description, acl: {} });
  }
}

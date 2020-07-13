import { Campaign, NewCampaign } from 'src/types/campaign';
import { Component, OnInit } from '@angular/core';

import { CampaignService } from 'src/app/data/campaign.service';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  list$: Observable<Campaign[]>;
  constructor(
    private campaignService: CampaignService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.list$ = this.campaignService.list();
  }
  openAdd() {
    this.dialog
      .open(CreateComponent)
      .afterClosed()
      .subscribe((v?: { name: string; description: string }) => {
        if (v) {
          console.log(v);
          this.campaignService.create({
            ...v,
            acl: {},
            skills: [],
            characters: [],
          });
        }
      });
  }
}

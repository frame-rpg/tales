import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { InitiativeComponent } from './initiative.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InitiativeService {
  constructor(
    private dialogService: MatDialog,
    private campaignService: CampaignService
  ) {}

  async trigger(c: Campaign, gm: string) {
    const rollRequest = await this.dialogService
      .open(InitiativeComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (rollRequest) {
      await Promise.all(
        c.characters.map((character) =>
          this.campaignService.requestRoll({
            campaign: c.id,
            state: 'requested',
            modifier: rollRequest.modifier,
            roller: character,
            requester: gm,
            skills: ['initiative'],
            target: 'open',
          })
        )
      );
    }
    return rollRequest;
  }
}

import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'types/character';
import { DefendComponent } from './defend.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollRequest } from 'types/message';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DefendService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService
  ) {}

  async trigger(character: Character, campaignId: string) {
    const result = await this.dialogService
      .open(DefendComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      const rollRequest: RollRequest = {
        messageType: 'rollRequest',
        at: new Date(),
        type: 'defense',
        description: 'Defense Check',
        skillModifier: 0,
        conditionalEdge: 0,
        state: 'new',
        from: {
          type: 'campaign',
          id: campaignId,
        },
        to: {
          type: 'character',
          id: character.id,
        },
      };
      if (result.modifier) {
        rollRequest.skillModifier = result.modifier;
      }
      await this.messageService.send(rollRequest);
    }
  }
}

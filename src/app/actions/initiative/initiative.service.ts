import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'types/character';
import { InitiativeComponent } from './initiative.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollRequest } from 'types/message';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InitiativeService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private firestore: AngularFirestore
  ) {}

  async trigger(characters: Character[], campaignId: string) {
    const result = await this.dialogService
      .open(InitiativeComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      await Promise.all(
        characters.map(async (character) => {
          if (
            character.type === 'nonplayer' ||
            character.type === 'companion'
          ) {
            await this.firestore.doc(`/characters/${character.id}`).update({
              initiative: character.baseInitiative,
            });
          } else {
            await this.firestore.doc(`/characters/${character.id}`).update({
              initiative: 0,
            });
            const rollRequest: RollRequest = {
              messageType: 'rollRequest',
              type: 'initiative',
              at: new Date(),
              description: 'Initiative Check',
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
        })
      );
    }
  }
}

import { Character, PlayerCharacter } from 'types/character';
import { RollComplete, RollRequest, SentMessage } from 'types/message';

import { AngularFirestore } from '@angular/fire/firestore';
import { CharacterService } from 'src/app/data/character.service';
import { InitiativeComponent } from './initiative.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InitiativeService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private firestore: AngularFirestore,
    private characterService: CharacterService
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
  async handle(
    character: PlayerCharacter,
    request: RollRequest,
    result: RollComplete
  ) {
    const patch: Partial<PlayerCharacter> = {};
    if (result.effort > 0) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - result.effort
      );
      patch.initiative = result.effort;
    }
    await this.characterService.update(character.id, patch);
    result.description = `${character.name} rolled ${result.result} for initiative`;
    await this.messageService.send(result);
  }
}

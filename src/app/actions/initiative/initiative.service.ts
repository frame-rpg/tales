import { Character, PlayerCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { AngularFirestore } from '@angular/fire/firestore';
import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { InitiativeComponent } from './initiative.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { campaign } from 'admin/src/campaign';
import { idPluck } from 'src/app/data/util';
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

  async trigger(characters: Character[], campaignId: CampaignId) {
    const result = await this.dialogService
      .open(InitiativeComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      await Promise.all(
        characters.map(async (character) => {
          if (
            character.subtype === 'nonplayer' ||
            character.subtype === 'companion'
          ) {
            await this.characterService.setInitiative(
              character,
              character.baseInitiative
            );
          } else {
            await this.characterService.setInitiative(character, 0);
            const rollRequest: Omit<RollRequest, 'messageId'> = {
              messageType: 'rollRequest',
              type: 'initiative',
              at: new Date(),
              description: 'Initiative Check',
              skillModifier: 0,
              conditionalEdge: 0,
              state: 'new',
              from: idPluck(campaignId),
              to: idPluck(character),
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
    result: Omit<RollComplete, 'messageId'>
  ) {
    await this.characterService.update(character, {
      initiative: result.result,
    });
    result.description = `${character.name} rolled ${result.result} for initiative`;
    await this.messageService.send(result);
  }
}

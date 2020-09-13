import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest, SentMessage } from 'types/message';

import { AngularFirestore } from '@angular/fire/firestore';
import { CharacterService } from 'src/app/data/character.service';
import { DefendComponent } from './defend.component';
import { HealthService } from '../health/health.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MessageService } from 'src/app/data/message.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DefendService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private characterService: CharacterService,
    private healthService: HealthService
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
        target: result.target,
        damage: result.damage,
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

  async handle(
    character: SkilledCharacter,
    request: RollRequest,
    result: RollComplete
  ) {
    await this.messageService.send({
      ...result,
      description: `${character.name} rolled ${result.result} for ${
        result.skill.type
      } (target: ${request.target}). ${
        result.success ? 'Success!' : 'Failure.'
      }`,
    });
    if (!result.success) {
      await this.healthService.trigger(
        character,
        request.from.id,
        request.damage + request.target - result.result
      );
    }
  }
}

import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { AngularFirestore } from '@angular/fire/firestore';
import { AttackComponent } from './attack.component';
import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollService } from '../roll/roll.service';
import { idPluck } from 'src/app/data/util';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AttackService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private characterService: CharacterService,
    private rollService: RollService
  ) {}

  async trigger(character: Character, campaign: CampaignId) {
    const result = await this.dialogService
      .open(AttackComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      const rollRequest: Omit<RollRequest, 'messageId'> = {
        messageType: 'rollRequest',
        at: new Date(),
        type: 'attack',
        description: 'Attack Check',
        skillModifier: 0,
        target: result.target,
        initiative: result.initiative,
        damage: result.damage,
        conditionalEdge: 0,
        state: 'new',
        from: idPluck(campaign),
        to: idPluck(character),
      };
      if (result.modifier) {
        rollRequest.skillModifier = result.modifier;
      }
      const rollResult = await this.rollService.trigger(
        rollRequest,
        character as SkilledCharacter
      );
      await this.handle(character as SkilledCharacter, rollRequest, rollResult);
    }
  }

  async handle(
    character: SkilledCharacter,
    request: Omit<RollRequest, 'messageId'>,
    result: Omit<RollComplete, 'messageId'>
  ) {
    await this.messageService.send({
      ...result,
      description: `${character.name} rolled ${result.result} for ${
        result.skill.type
      } (target: ${request.target}). ${
        result.success
          ? result.result - request.target + request.damage + ' damage.'
          : 'Failure.'
      }`,
    });
    const patch = {
      initiative: character.initiative + request.initiative + result.effort,
    };
    if (result.effort) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - result.effort
      );
    }
    await this.characterService.update(character, patch);
  }
}

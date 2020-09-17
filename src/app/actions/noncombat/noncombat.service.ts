import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { CharacterSkill } from 'types/skill';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { NoncombatComponent } from './noncombat.component';
import { RollService } from '../roll/roll.service';
import { idPluck } from 'src/app/data/util';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoncombatService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private characterService: CharacterService,
    private rollService: RollService
  ) {}

  async trigger(
    character: SkilledCharacter,
    skillId: string,
    immediate = false
  ) {
    const result = await this.dialogService
      .open(NoncombatComponent, { data: character })
      .afterClosed()
      .pipe(take(1))
      .toPromise();

    if (result) {
      const rollRequest: Omit<RollRequest, 'messageId'> = {
        messageType: 'rollRequest',
        at: new Date(),
        type: 'noncombat',
        description: 'General Check',
        assets: result.assets || 0,
        initiative: result.initiative,
        skills: [skillId],
        edge: result.edge || 0,
        target: result.target || null,
        state: 'new',
        from: { type: 'campaign', campaignId: character.campaignId },
        to: idPluck(character),
      };
      if (immediate) {
        const rollResult = await this.rollService.trigger(
          rollRequest,
          character as SkilledCharacter
        );
        if (rollResult) {
          await this.handle(
            character as SkilledCharacter,
            rollRequest,
            rollResult
          );
        }
      } else {
        await this.messageService.send(rollRequest);
      }
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
        result.skill.name
      }. ${
        request.target
          ? `Target: ${request.target}, ${
              result.success ? 'Success!' : 'Failure.'
            }`
          : ''
      }.`,
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

import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
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

  async triggerSelf(character: SkilledCharacter) {
    const rollRequest: Omit<RollRequest, 'messageId'> = {
      messageType: 'rollRequest',
      at: new Date(),
      type: 'noncombat',
      description: 'General Check',
      skillModifier: 0,
      skills: character.skills
        .filter((skill) => skill.type === 'noncombat')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((skill) => skill.skillId),
      initiative: 10,
      conditionalEdge: 0,
      state: 'new',
      from: { type: 'campaign', campaignId: character.campaignId },
      to: idPluck(character),
    };
    console.log(rollRequest);
    const rollResult = await this.rollService.trigger(
      rollRequest,
      character as SkilledCharacter
    );
    if (rollResult) {
      await this.handle(character as SkilledCharacter, rollRequest, rollResult);
    }
  }

  async trigger(character: Character, campaign: CampaignId) {
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
        skillModifier: result.modifier || 0,
        skills: result.skills,
        conditionalEdge: 0,
        state: 'new',
        from: idPluck(campaign),
        to: idPluck(character),
      };
      if (result.target) {
        rollRequest.target = result.target;
      }
      await this.messageService.send(rollRequest);
    }
  }

  async handle(
    character: SkilledCharacter,
    request: Omit<RollRequest, 'messageId'>,
    result: Omit<RollComplete, 'messageId'>
  ) {
    await this.messageService.send({
      ...result,
      description: `${character.name} rolled ${result.result} for ${result.skill.name}.`,
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

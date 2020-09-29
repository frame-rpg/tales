import { Attack, AttackRequest, AttackResult } from 'types/roll';
import { Character, SkilledCharacter } from 'types/character';

import { AttackComponent } from './attack.component';
import { CharacterService } from 'src/app/data/character.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollService } from '../roll/roll.service';
import { Weapon } from 'types/equipment';
import { basicRequest } from '../common';
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

  async triggerSelf(character: SkilledCharacter, weapon: Weapon) {
    const customMelee = {
      ...basicMelee,
      skills: character.skills
        .filter((skill) => skill.category === 'melee')
        .map((skill) => skill.skillId),
    };
    const customRanged = {
      ...basicRanged,
      skills: character.skills
        .filter((skill) => skill.category === 'ranged')
        .map((skill) => skill.skillId),
    };

    const result: Attack = await this.dialogService
      .open(AttackComponent, { data: character })
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      const rollRequest: AttackRequest = {
        ...result,
        ...basicRequest(character),
      };
      const rollResult: AttackResult = await this.rollService.trigger(
        rollRequest,
        character as SkilledCharacter,
        weapon
      );
      if (rollResult) {
        await this.handle(
          character as SkilledCharacter,
          rollRequest,
          rollResult
        );
      }
    }
  }

  async handle(
    character: SkilledCharacter,
    request: AttackRequest,
    result: AttackResult
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

export const basicMelee: Omit<Weapon, 'skills'> = {
  type: 'weapon',
  kind: 'melee',
  initiative: 0,
  damage: 0,
  slot: 'other',
  equipped: false,
  size: 0,
  name: 'Custom Melee Weapon',
  effect: {},
};

export const basicRanged: Omit<Weapon, 'skills'> = {
  type: 'weapon',
  kind: 'ranged',
  initiative: 0,
  damage: 0,
  slot: 'other',
  equipped: false,
  size: 0,
  name: 'Custom Ranged Weapon',
  effect: {},
};

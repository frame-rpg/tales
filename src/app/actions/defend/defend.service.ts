import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { DefendComponent } from './defend.component';
import { HealthService } from '../health/health.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { countCharacter } from 'src/app/data/modifiers';
import { idPluck } from 'src/app/data/util';
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

  async trigger(character: Character, campaign: CampaignId) {
    const result = await this.dialogService
      .open(DefendComponent)
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (result) {
      const modifier = countCharacter(character, 'defense');
      const rollRequest: Omit<RollRequest, 'messageId'> = {
        messageType: 'rollRequest',
        at: new Date(),
        type: 'defense',
        description: 'Defense Check',
        assets: result.assets + modifier.assets,
        target: result.target,
        damage: result.damage,
        edge: modifier.edge,
        state: 'new',
        from: idPluck(campaign),
        to: idPluck(character),
        items: modifier.relevant,
      };
      await this.messageService.send(rollRequest);
    }
  }

  async handle(
    character: SkilledCharacter,
    request: RollRequest,
    result: Omit<RollComplete, 'messageId'>
  ) {
    await this.messageService.send({
      ...result,
      description: `${character.name} rolled ${result.result} for ${
        result.skill.type
      } (target: ${request.target}). ${
        result.success ? 'Success!' : 'Failure.'
      }`,
    });
    if (result.effort) {
      const patch: any = {};
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - result.effort
      );
      patch.initiative = character.initiative + result.effort;
      await this.characterService.update(character, patch);
    }

    if (!result.success) {
      await this.healthService.trigger(
        character,
        request.from as CampaignId,
        request.damage + request.target - result.result
      );
    }
  }
}

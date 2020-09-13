import { Character, SkilledCharacter } from 'types/character';
import { RollComplete, RollRequest } from 'types/message';

import { CampaignId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { HealthComponent } from './health.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { campaign } from 'admin/src/campaign';
import { idPluck } from 'src/app/data/util';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(
    private dialogService: MatDialog,
    private messageService: MessageService,
    private characterService: CharacterService
  ) {}

  async trigger(character: Character, campaignId: CampaignId, target: number) {
    const rollRequest: Omit<RollRequest, 'messageId'> = {
      messageType: 'rollRequest',
      at: new Date(),
      type: 'health',
      description: 'Health Check',
      skillModifier: 0,
      target: target,
      conditionalEdge: 0,
      state: 'new',
      from: idPluck(campaignId),
      to: idPluck(character),
    };
    await this.messageService.send(rollRequest);
  }

  async triggerWound(character: Character) {
    const result = await this.dialogService
      .open(HealthComponent, { data: character, disableClose: true })
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    const patch = {};
    patch[`attributes.${result.attribute}.wound`] = true;
    patch[`attributes.${result.attribute}.current`] = 0;
    await this.characterService.update(character, patch);
    return result.attribute;
  }

  async handle(
    character: SkilledCharacter,
    request: RollRequest,
    result: Omit<RollComplete, 'messageId'>
  ) {
    const patch: Partial<SkilledCharacter> = {};
    if (result.effort > 0) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - result.effort
      );
    }
    if (!result.success) {
      const wounded = await this.triggerWound(character);
      await this.messageService.send({
        ...result,
        description: `${character.name} rolled ${result.result} on a health check (target: ${request.target}). ${wounded} was wounded.`,
      });
    } else {
      await this.messageService.send({
        ...result,
        description: `${character.name} rolled ${result.result} on a health check (target: ${request.target})`,
      });
    }
  }
}

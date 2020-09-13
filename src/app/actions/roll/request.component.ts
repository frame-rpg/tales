import { Component, Input, OnInit } from '@angular/core';

import { CharacterService } from 'src/app/data/character.service';
import { DefendService } from '../defend/defend.service';
import { HealthService } from '../health/health.service';
import { InitiativeService } from '../initiative/initiative.service';
import { MessageService } from 'src/app/data/message.service';
import { PlayerCharacter } from 'types/character';
import { RollRequest } from 'types/message';
import { RollService } from '../roll/roll.service';

@Component({
  selector: 'initiative-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() roll: RollRequest & { id: string };
  @Input() character: PlayerCharacter;

  constructor(
    private rollService: RollService,
    private messageService: MessageService,
    private characterService: CharacterService,
    private defendService: DefendService,
    private healthService: HealthService,
    private initiativeService: InitiativeService
  ) {}

  ngOnInit(): void {}

  async trigger(e: MouseEvent) {
    const result = await this.rollService.trigger(this.roll, this.character);
    await this.characterService.update(this.character.id, {
      [`attributes.${result.attribute}.current`]: Math.max(
        0,
        this.character.attributes[result.attribute].current - result.effort
      ),
    });
    if (result) {
      if (result.skill.type === 'defense') {
        await this.defendService.handle(this.character, this.roll, result);
      } else if (result.skill.type === 'initiative') {
        await this.initiativeService.handle(this.character, this.roll, result);
      } else if (result.skill.type === 'health') {
        await this.healthService.handle(this.character, this.roll, result);
      } else {
        if (result.effort > 0) {
          if (
            result.skill.type === 'attack' ||
            result.skill.type === 'noncombat'
          ) {
            await this.characterService.update(this.character.id, {
              initiative: this.character.initiative + result.effort,
            });
            await this.messageService.send({
              ...result,
              description: `${this.character.name} rolled ${result.result} for  ${result.skill.type}.`,
            });
          }
        }
      }
      await this.messageService.mark(this.roll, 'viewed');
    }
  }
}

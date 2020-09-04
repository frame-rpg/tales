import { Component, Input, OnInit } from '@angular/core';

import { CharacterService } from 'src/app/data/character.service';
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
  @Input() roll: RollRequest & { type: 'initiative'; id: string };
  @Input() character: PlayerCharacter;

  constructor(
    private rollService: RollService,
    private messageService: MessageService,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {}

  async trigger(e: MouseEvent) {
    const result = await this.rollService.trigger(this.roll, this.character);
    await this.messageService.mark(this.roll, 'viewed');
    const patch: Partial<PlayerCharacter> = {
      initiative: result.result,
    };
    if (result.effort > 0) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        this.character.attributes[result.attribute].current - result.effort
      );
    }
    await this.characterService.update(this.character.id, patch);
    result.description = `${this.character.name} rolled ${result.result} for initiative.`;
    await this.messageService.send(result);
  }
}

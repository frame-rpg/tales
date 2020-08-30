import { Component, Input, OnInit } from '@angular/core';

import { PlayerCharacter } from 'types/character';
import { RollRequest } from 'types/message';
import { RollService } from '../roll/roll.service';

@Component({
  selector: 'initiative-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() roll: RollRequest & { type: 'initiative' };
  @Input() character: PlayerCharacter;

  constructor(private rollService: RollService) {}

  ngOnInit(): void {}

  trigger(e: MouseEvent) {
    this.rollService.trigger(this.roll, this.character);
  }
}

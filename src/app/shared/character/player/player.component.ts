import { Component, Input } from '@angular/core';

import { PlayerCharacter } from 'src/types/player_character';

@Component({
  selector: 'player-character',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() character: PlayerCharacter;
  constructor() {}
}

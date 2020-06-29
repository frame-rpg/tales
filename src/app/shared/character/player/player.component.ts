import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';

@Component({
  selector: 'player-character',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() character: Observable<PlayerCharacter>;
  constructor() {}
}

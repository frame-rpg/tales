import { Component, Input, OnInit } from '@angular/core';

import { PlayerCharacter } from 'src/app/types/player_character';

@Component({
  selector: 'player-character',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() character: PlayerCharacter;
  constructor() {}

  ngOnInit(): void {}
}

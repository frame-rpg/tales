import { Component, Input, OnInit } from '@angular/core';
import { SKILLS, levels } from 'src/app/data/character.service';

import { PlayerCharacter } from 'src/app/types/player_character';

@Component({
  selector: 'player-character',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() character: PlayerCharacter;
  skillsMap = SKILLS;
  levels = levels;
  constructor() {}

  ngOnInit(): void {}
}

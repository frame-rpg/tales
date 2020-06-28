import { Component, Input, OnInit } from '@angular/core';
import { SKILLS, levels } from 'src/app/data/character.service';

import { PlayerCharacter } from 'src/app/types/player_character';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent implements OnInit {
  @Input() character: PlayerCharacter;
  skillsMap = SKILLS;
  levels = levels;
  constructor() {}

  ngOnInit(): void {}
}

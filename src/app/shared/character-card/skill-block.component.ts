import { Component, Input, OnInit } from '@angular/core';
import { SKILLS, levels } from 'src/app/data/character.service';

import { Companion } from 'src/app/types/companion';
import { DiceService } from 'src/app/core/random/dice/dice.service';
import { PlayerCharacter } from 'src/app/types/player_character';

@Component({
  selector: 'skill-block',
  templateUrl: './skill-block.component.html',
  styleUrls: ['./skill-block.component.scss'],
})
export class SkillBlockComponent implements OnInit {
  @Input() character: PlayerCharacter | Companion;
  skillsMap = SKILLS;
  levels = levels;
  constructor(private dice: DiceService) {}

  ngOnInit(): void {}
  async roll({ key, value }: { key: string; value: number }) {
    console.log(await this.dice.roll(value, 0));
  }
}

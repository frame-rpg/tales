import { Component, Input, OnInit } from '@angular/core';

import { Companion } from 'src/app/types/companion';
import { DiceService } from 'src/app/core/random/dice/dice.service';
import { PlayerCharacter } from 'src/app/types/player_character';

@Component({
  selector: 'skill-block',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @Input() character: PlayerCharacter | Companion;
  constructor(private dice: DiceService) {}

  ngOnInit(): void {}
  async roll({ key, value }: { key: string; value: number }) {
    console.log(await this.dice.roll(value, 0));
  }
}

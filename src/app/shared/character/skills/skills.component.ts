import { Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { SkillDescription, SkillDetails, SkillLevels } from 'src/types/skill';
import { map, take } from 'rxjs/operators';

import { Companion } from 'src/types/companion';
import { DiceService } from 'src/app/core/random/dice/dice.service';
import { PlayerCharacter } from 'src/types/player_character';
import { RulesService } from 'src/app/data/rules.service';

@Component({
  selector: 'skill-block',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @Input() character: PlayerCharacter | Companion;
  skillLevels: SkillLevels;
  skillDetails: SkillDetails;

  constructor(private dice: DiceService, private rules: RulesService) {}

  async ngOnInit() {
    this.skillLevels = await this.rules.skillLevels().pipe(take(1)).toPromise();
    this.skillDetails = await this.rules.skillInfo().pipe(take(1)).toPromise();
  }

  async roll({ name, level }: { name: string; level: number }) {
    console.log(await this.dice.roll(level, 0));
  }
}

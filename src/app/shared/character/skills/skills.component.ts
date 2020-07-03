import { Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Companion } from 'src/types/companion';
import { DiceService } from 'src/app/core/random/dice/dice.service';
import { PlayerCharacter } from 'src/types/player_character';
import { RulesService } from 'src/app/data/rules.service';
import { SkillDescription } from 'src/types/skill';

@Component({
  selector: 'skill-block',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  @Input() character: PlayerCharacter | Companion;
  skillDetails: Observable<SkillDescription[]>;
  constructor(private dice: DiceService, private rules: RulesService) {}

  // ngOnInit(): void {
  //   this.skillDetails = combineLatest([
  //     this.rules.skillInfo(),
  //     this.rules.skillLevels(),
  //     this.character,
  //   ]).pipe(
  //     filter(
  //       ([skillInfo, skillLevels, character]) =>
  //         !!skillInfo && !!skillLevels && !!character
  //     ),
  //     map(([skillInfo, skillLevels, character]) =>
  //       Object.keys(character.skills)
  //         .sort()
  //         .map((skillName) => ({
  //           ...skillInfo[skillName],
  //           levelName: skillLevels[character.skills[skillName]],
  //           level: character.skills[skillName],
  //         }))
  //     )
  //   );
  // }
  async roll({ name, level }: { name: string; level: number }) {
    console.log(await this.dice.roll(level, 0));
  }
}

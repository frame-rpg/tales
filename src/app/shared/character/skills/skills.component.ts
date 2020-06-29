import { Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { SkillDescription, SkillDetails, SkillLevels } from 'src/types/skill';
import { filter, map, publishReplay, refCount, tap } from 'rxjs/operators';

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
  @Input() character: Observable<PlayerCharacter | Companion>;
  skillDetails: Observable<SkillDescription[]>;
  constructor(private dice: DiceService, private rules: RulesService) {}

  ngOnInit(): void {
    this.skillDetails = combineLatest([
      this.rules.skillInfo(),
      this.rules.skillLevels(),
      this.character,
    ]).pipe(
      filter(
        ([skillInfo, skillLevels, character]) =>
          !!skillInfo && !!skillLevels && !!character
      ),
      map(([skillInfo, skillLevels, character]) =>
        Object.keys(character.skills).map((skillName) => ({
          ...skillInfo[skillName],
          levelName: skillLevels[character.skills[skillName]],
          level: character.skills[skillName],
        }))
      )
    );
  }
  async roll({ name, level }: { name: string; level: number }) {
    console.log(await this.dice.roll(level, 0));
  }
}

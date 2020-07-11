import { Component, Input, OnInit } from '@angular/core';
import { SkillDetails, SkillLevels } from 'src/types/skill';
import { map, take } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Companion } from 'src/types/companion';
import { DiceService } from 'src/app/core/random/dice/dice.service';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';
import { RulesService } from 'src/app/data/rules.service';
import { User } from 'src/types/user';

@Component({
  selector: 'skill-block',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @Input() character: PlayerCharacter | Companion;
  @Input() gm: User;
  skillLevels: SkillLevels;
  skillDetails: SkillDetails;

  constructor(
    private dice: DiceService,
    private rules: RulesService,
    public auth: AngularFireAuth
  ) {}

  async ngOnInit() {
    this.skillLevels = await this.rules.skillLevels().pipe(take(1)).toPromise();
    this.skillDetails = await this.rules.skillInfo().pipe(take(1)).toPromise();
  }

  async roll({ name, level }: { name: string; level: number }) {
    console.log(await this.dice.roll(level, 0));
  }
}

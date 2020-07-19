import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Character, SkilledCharacter } from 'src/types/character';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { CharacterService } from 'src/app/data/character.service';
import { DisplaySkill } from 'src/types/skill';
import { Roll } from 'src/types/event';
import { RulesService } from 'src/app/data/rules.service';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';

@Component({
  selector: 'roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.scss'],
})
export class RollComponent implements OnInit, OnChanges {
  @Input() roll: Roll;
  @Input() campaignId: string;
  private rollSubject = new BehaviorSubject<Roll>(null);
  roll$ = this.rollSubject.asObservable().pipe(
    filter((v) => !!v),
    distinctUntilChanged()
  );
  userIsRoller: Observable<boolean>;
  userRequestedRoll: Observable<boolean>;
  roller: Observable<SkilledCharacter>;
  requester: Observable<User>;
  skills: Observable<DisplaySkill[]>;

  constructor(
    private auth: AngularFireAuth,
    private characterService: CharacterService,
    private userService: UserService,
    private rulesService: RulesService
  ) {}

  ngOnInit(): void {
    this.roller = this.roll$.pipe(
      switchMap(
        (roll) =>
          this.characterService.get(this.campaignId, roll.roller) as Observable<
            SkilledCharacter
          >
      )
    );

    this.requester = this.roll$.pipe(
      switchMap((roll) => this.userService.get(roll.requester))
    );

    this.userIsRoller = combineLatest([this.roller, this.auth.user]).pipe(
      map(([roller, user]) => roller.acl[user.uid] === 'admin')
    );

    this.userRequestedRoll = combineLatest([
      this.requester,
      this.auth.user,
    ]).pipe(map(([requester, user]) => requester.id === user.uid));

    this.skills = combineLatest([
      this.roll$,
      this.roller,
      this.rulesService.skillInfo(),
      this.rulesService.skillLevels(),
    ]).pipe(
      map(([roll, roller, skillInfo, skillLevels]) =>
        roll.skills.map((skill) => ({
          name: skillInfo[skill].name,
          level: roller.skills[skill],
          levelName: skillLevels[roller.skills[skill]],
          description: skillInfo[skill].description,
        }))
      )
    );
  }

  ngOnChanges(update) {
    this.rollSubject.next(update.roll.currentValue);
  }
}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplaySkill } from 'src/types/skill';
import { SkilledCharacter } from 'src/types/character';
import { DisplayAttribute } from 'src/types/attribute';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  from,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  reduce,
  tap,
  scan,
  startWith,
  distinctUntilChanged,
} from 'rxjs/operators';
import { RollService } from '../roll.service';
import { Roll } from 'src/types/event';
import { CharacterService } from 'src/app/data/character.service';

export interface InjectedData {
  skill: DisplaySkill;
  attributes: DisplayAttribute[];
  character: SkilledCharacter;
  roll: Roll;
}

function reduceRoll(roll: Roll, thing: Partial<Roll>): Roll {
  return { ...roll, ...thing };
}

enum RollState {
  SELECTING_ATTRIBUTE,
  ATTRIBUTE_SELECTED,
  MANUAL_ROLL,
  ROLLED,
  POOLED,
}

@Component({
  selector: 'app-resolve',
  templateUrl: './resolve.component.html',
  styleUrls: ['./resolve.component.scss'],
})
export class ResolveComponent implements OnInit, OnDestroy {
  private rollSubject = new BehaviorSubject<Partial<Roll>>({});
  roll: Observable<Roll> = this.rollSubject
    .asObservable()
    .pipe(
      scan<Partial<Roll>, Roll>(reduceRoll),
      tap(console.log.bind(console))
    );
  skills: Observable<DisplaySkill[]>;
  attributes: Observable<DisplayAttribute[]>;
  subcription: Subscription;
  RollState = RollState;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    private rollService: RollService,
    private characterService: CharacterService
  ) {
    this.rollSubject.next(data.roll);
    this.skills = this.characterService.mapDisplaySkills(
      from([this.data.character]),
      this.roll.pipe(map((roll) => roll.skills))
    );

    this.attributes = combineLatest([
      this.characterService.mapDisplayAttributes(from([this.data.character])),
      this.roll,
    ]).pipe(
      filter(([c, r]) => c && !!r.skill),
      map(([characterAttributes, roll]) =>
        characterAttributes.filter((attr) =>
          roll.skill.attributes.includes(attr.name)
        )
      ),
      startWith([])
    );
    this.subcription = combineLatest([this.roll, this.attributes, this.skills])
      .pipe(distinctUntilChanged((a, b) => a[0] === b[0]))
      .subscribe(([roll, attributes, skills]) => {
        console.log(roll);
        if (
          roll.skill &&
          attributes &&
          attributes.length === 1 &&
          !roll.attribute
        ) {
          this.rollSubject.next({ attribute: attributes[0] });
        }
        if (!roll.skill && skills && skills.length === 1) {
          this.rollSubject.next({ skill: skills[0] });
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  selectAttribute(attribute: DisplayAttribute) {
    this.rollSubject.next({ attribute });
  }

  selectSkill(skill: DisplaySkill) {
    this.rollSubject.next({ skill });
  }

  autoRoll(roll: Roll) {
    this.rollSubject.next({
      dice: new Array(Math.abs(roll.skill.level) + 1)
        .fill(0)
        .map(() => Math.floor(Math.random() * 12) + 1),
    });
  }

  manualRoll(roll: Roll) {
    this.rollSubject.next({
      dice: new Array(Math.abs(roll.skill.level) + 1).fill(0),
    });
  }

  setRoll(numbers: number[]) {
    this.rollSubject.next({ dice: numbers });
  }

  rolled(numbers: number[]) {
    return numbers.every((v) => !!v && v > 0);
  }

  private skillSize() {
    return Math.abs(this.data.skill.level) + 1;
  }
}

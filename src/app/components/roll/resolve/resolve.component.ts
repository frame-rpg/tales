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
  publishReplay,
  refCount,
} from 'rxjs/operators';
import { RollService } from '../roll.service';
import { Roll } from 'src/types/event';
import { CharacterService } from 'src/app/data/character.service';

export interface InjectedData {
  skills: DisplaySkill[];
  attributes: DisplayAttribute[];
  character: SkilledCharacter;
  roll: Roll;
}

function reduceRoll(data: InjectedData) {
  return (roll: Roll, thing: Partial<Roll>): Roll => {
    const soFar: Roll = { ...roll, ...thing };
    if (!soFar.skill && soFar.skills && soFar.skills.length === 1) {
      soFar.skill = data.skills[0];
    }
    if (
      !soFar.attribute &&
      soFar.skill &&
      soFar.skill.attributes.length === 1
    ) {
      soFar.attribute = data.attributes.filter(
        (attribute) => attribute.name === soFar.skill.attributes[0]
      )[0];
    }
    console.log(soFar);
    return soFar;
  };
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
  private rollSubject = new BehaviorSubject<Partial<Roll>>(null);
  roll: Observable<Roll>;
  attributes: Observable<DisplayAttribute[]>;
  RollState = RollState;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    private rollService: RollService,
    private characterService: CharacterService
  ) {
    this.roll = this.rollSubject
      .asObservable()
      .pipe(
        publishReplay(1),
        refCount(),
        startWith({}),
        scan<Partial<Roll>, Roll>(reduceRoll(this.data))
      );
    this.attributes = this.roll.pipe(
      filter((r) => !!r.skill),
      map((roll) =>
        this.data.attributes.filter((attr) =>
          roll.skill.attributes.includes(attr.name)
        )
      ),
      startWith([])
    );
    this.rollSubject.next(data.roll);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

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
}

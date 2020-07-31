import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplaySkill } from 'src/types/skill';
import { SkilledCharacter } from 'src/types/character';
import { DisplayAttribute } from 'src/types/attribute';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface InjectedData {
  skill: DisplaySkill;
  attributes: DisplayAttribute[];
  character: SkilledCharacter;
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
export class ResolveComponent implements OnInit {
  private attributeSubject = new BehaviorSubject<DisplayAttribute>(null);
  private diceSubject = new BehaviorSubject<number[]>(null);
  private stateSubject = new BehaviorSubject<RollState>(
    RollState.SELECTING_ATTRIBUTE
  );
  status = combineLatest([
    this.attributeSubject.asObservable().pipe(filter((v) => !!v)),
    this.diceSubject.asObservable().pipe(filter((v) => !!v)),
    this.stateSubject.asObservable().pipe(filter((v) => !!v)),
  ]).pipe(
    filter(([attribute, dice, state]) => !!attribute && !!dice && !!state),
    map(([attribute, dice, state]) => ({
      attribute,
      dice,
      state,
    }))
  );
  RollState = RollState;
  constructor(@Inject(MAT_DIALOG_DATA) public data: InjectedData) {}

  ngOnInit(): void {}

  startRoll(attribute: DisplayAttribute) {
    this.attributeSubject.next(attribute);
    this.diceSubject.next(new Array(this.skillSize()).fill(0));
    this.stateSubject.next(RollState.ATTRIBUTE_SELECTED);
  }

  autoRoll() {
    this.diceSubject.next(
      new Array(this.skillSize())
        .fill(0)
        .map(() => Math.floor(Math.random() * 12) + 1)
    );
    this.stateSubject.next(RollState.ROLLED);
  }

  manualRoll() {
    this.stateSubject.next(RollState.MANUAL_ROLL);
  }

  acceptManual(numbers: number[]) {
    this.diceSubject.next(numbers);
    this.stateSubject.next(RollState.ROLLED);
  }

  private skillSize() {
    return Math.abs(this.data.skill.level) + 1;
  }
}

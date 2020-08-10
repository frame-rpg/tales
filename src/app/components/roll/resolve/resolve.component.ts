import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisplaySkill } from 'src/types/skill';
import { SkilledCharacter } from 'src/types/character';
import { DisplayAttribute } from 'src/types/attribute';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
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
import { CampaignService } from 'src/app/data/campaign.service';

export interface InjectedData {
  skills: DisplaySkill[];
  attributes: DisplayAttribute[];
  character: SkilledCharacter;
  roll: Roll;
}

function skillDirection(skill: DisplaySkill) {
  if (skill.id !== 'initiative') {
    return 1;
  } else {
    return -1;
  }
}

@Component({
  selector: 'app-resolve',
  templateUrl: './resolve.component.html',
  styleUrls: ['./resolve.component.scss'],
})
export class ResolveComponent implements OnInit, OnDestroy {
  rollState = new FormGroup({
    attribute: new FormControl(null),
    skill: new FormControl(null),
    target: new FormControl('open'),
    dice: new FormArray([]),
    effort: new FormControl(0, [Validators.min(0)]),
    state: new FormControl('pickSkill'),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    private campaignService: CampaignService,
    public matDialogRef: MatDialogRef<ResolveComponent>
  ) {
    if (data.skills.length === 1) {
      this.rollState.get('skill').setValue(data.skills[0]);
    }
    this.rollState.get('target').setValue(data.roll.target);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  get skill() {
    return this.rollState.get('skill').value as DisplaySkill;
  }

  get attribute() {
    return this.rollState.get('attribute').value as DisplayAttribute;
  }

  get dice() {
    return this.rollState.get('dice').value as number[];
  }

  get target() {
    return this.rollState.get('target').value as string;
  }

  get attributes() {
    return this.data.attributes.filter((attribute) =>
      this.skill?.attributes.includes(attribute.name)
    );
  }

  get die() {
    if (this.dice.length === 0) {
      return 0;
    } else if (this.skill.level < 0 || this.direction < 0) {
      return Math.min(...this.dice);
    } else {
      return Math.max(...this.dice);
    }
  }

  get direction() {
    if (this.skill && this.skill.id === 'initiative') {
      return -1;
    } else {
      return 1;
    }
  }

  get effort() {
    return this.rollState.get('effort').value as number;
  }

  get step(): string {
    if (this.skill === null) {
      return 'pickSkill';
    } else if (this.attribute === null) {
      return 'pickAttribute';
    } else if (this.dice.length === 0) {
      return 'chooseRollType';
    } else if (this.dice.some((v) => v === 0)) {
      return 'manualRoll';
    }
    return 'ready';
  }

  selectAttribute(attribute: DisplayAttribute) {
    this.rollState.get('attribute').setValue(attribute);
    this.rollState.get('state').setValue('pickSkill');
  }

  selectSkill(skill: DisplaySkill) {
    this.rollState.get('skill').setValue(skill);
    this.rollState.get('state').setValue('chooseRollType');
  }

  autoRoll() {
    const diceCount = Math.abs(this.skill.level) + 1;
    const dice = new Array(diceCount)
      .fill(0)
      .map((v) => Math.floor(Math.random() * 12) + 1);
    dice.forEach((die) =>
      (this.rollState.get('dice') as FormArray).push(
        new FormControl(die, [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
        ])
      )
    );
  }

  manualRoll() {
    const diceCount = Math.abs(this.skill.level) + 1;
    const dice = new Array(diceCount).fill(0);
    dice.forEach((die) =>
      (this.rollState.get('dice') as FormArray).push(
        new FormControl(die, [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
        ])
      )
    );
  }

  acceptRoll() {}

  setRoll() {}

  finalize() {
    this.matDialogRef.close();
  }

  rolled(numbers: number[]) {
    return numbers.every((v) => !!v && v > 0);
  }
}

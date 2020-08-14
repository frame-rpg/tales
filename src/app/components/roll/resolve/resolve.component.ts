import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisplaySkill, SkillDescription } from 'src/types/skill';
import { SkilledCharacter } from 'src/types/character';
import { DisplayAttribute } from 'src/types/attribute';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormArray,
  FormGroup,
  AbstractControl,
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
  rollState = new FormGroup(
    {
      target: new FormControl('open'),
      dice: new FormArray([]),
      effort: new FormControl(0, [
        Validators.min(0),
        (e) => this.validateEffort(e),
      ]),
    },
    () => this.validate()
  );
  manuallyRolling = false;
  skill: DisplaySkill;
  attribute: DisplayAttribute;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    private campaignService: CampaignService,
    public matDialogRef: MatDialogRef<ResolveComponent>
  ) {
    if (data.skills.length === 1) {
      this.skill = data.skills[0];
      if (this.attributes.length === 1) {
        this.attribute = this.attributes[0];
      }
    }
    this.rollState.get('target').setValue(data.roll.target);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  validate() {
    if (!this.skill) {
      return { selection: 'No skill chosen' };
    }
    if (!this.attribute) {
      return { selection: 'No attribute chosen' };
    }
    if (this.dice.length === 0) {
      return { dice: 'No roll method' };
    }
    if (this.dice.invalid) {
      return { dice: 'Incomplete roll' };
    }
    if (this.effort.invalid) {
      return { effort: 'Bad effort' };
    }
    return null;
  }

  validateEffort(e: AbstractControl) {
    if (
      this.attribute &&
      this.die &&
      this.die + this.direction * (e.value + this.attribute.edge) < 1 &&
      e.value > 0
    ) {
      return { tooHigh: 'Result cannot be below 1' };
    }
    if (this.attribute && e.value > this.attribute.current) {
      return { tooHigh: 'You cannot spend that much effort' };
    }
    return null;
  }

  get dice() {
    return this.rollState.get('dice') as FormArray;
  }

  get target() {
    return this.rollState.get('target').value as string;
  }

  get chosenDieIndex() {
    if (this.die) {
      return (this.dice.value as number[]).indexOf(this.die);
    } else {
      return -1;
    }
  }

  get attributes() {
    if (this.data.character.type === 'player') {
      return this.data.attributes.filter((attribute) =>
        this.skill?.attributes.includes(attribute.name)
      );
    } else {
      return this.data.attributes.filter(
        (attribute) => attribute.name === 'loyalty'
      );
    }
  }

  get die() {
    if (this.dice.length === 0) {
      return 0;
    } else if (this.skill.level < 0 || this.direction < 0) {
      return Math.min(...this.dice.value);
    } else {
      return Math.max(...this.dice.value);
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
    return this.rollState.get('effort');
  }

  get step(): string {
    if (!this.skill) {
      return 'pickSkill';
    } else if (!this.attribute) {
      return 'pickAttribute';
    } else if (this.dice.length === 0) {
      return 'chooseRollType';
    } else {
      return 'finalizing';
    }
  }

  selectAttribute(attribute: DisplayAttribute) {
    this.attribute = attribute;
  }

  selectSkill(skill: DisplaySkill) {
    this.skill = skill;
    if (this.attributes.length === 1) {
      this.attribute = this.attributes[0];
    }
  }

  autoRoll() {
    const diceCount = Math.abs(this.skill.level) + 1;
    const dice = new Array(diceCount)
      .fill(0)
      .map((v) => Math.floor(Math.random() * 12) + 1);
    this.roll(dice);
  }

  manualRoll() {
    const diceCount = Math.abs(this.skill.level) + 1;
    const dice = new Array(diceCount).fill(0);
    this.manuallyRolling = true;
    this.roll(dice);
    this.dice.markAllAsTouched();
  }

  roll(dice: number[]) {
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
}

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkilledCharacter } from 'types/character';
import {
  FormControl,
  Validators,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { CharacterSkill } from 'types/skill';
import { Level } from 'types/enums';
import { Attribute, AttributeName } from 'types/attribute';
import { RollRequest } from 'types/message';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from 'src/app/data/user.service';

export interface InjectedData {
  character: SkilledCharacter;
  roll: RollRequest;
}

@Component({
  selector: 'roll-dialog',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.scss'],
})
export class RollComponent implements OnDestroy {
  rollState: FormGroup;
  manuallyRolling = false;
  attribute: Attribute;
  private _chosenSkill: CharacterSkill;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    public matDialogRef: MatDialogRef<RollComponent>,
    private userService: UserService
  ) {
    this.rollState = new FormGroup(
      {
        dice: new FormArray([]),
        effort: new FormControl(0, {
          validators: [Validators.min(0), (e) => this.validateEffort(e)],
          updateOn: 'change',
        }),
      },
      () => this.validate()
    );
  }

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

  get direction() {
    return this.data.roll.type === 'initiative' ? -1 : 1;
  }

  get target() {
    return this.data.roll.target;
  }

  get chosenDieIndex() {
    if (this.die) {
      return (this.dice.value as number[]).indexOf(this.die);
    } else {
      return -1;
    }
  }

  get roll() {
    return this.data.roll;
  }

  get skills() {
    if (this.roll.skills?.length > 0) {
      return this.data.character.skills.filter((skill) =>
        this.roll.skills.includes(skill.id)
      );
    } else {
      return this.data.character.skills.filter(
        (skill) => skill.type === this.roll.type
      );
    }
  }

  get skill() {
    if (this.skills.length === 1) {
      return this.skills[0];
    } else if (this._chosenSkill) {
      return this._chosenSkill;
    } else {
      return null;
    }
  }

  get attributes() {
    return Object.entries(this.data.character.attributes)
      .filter(
        ([key]) =>
          key === 'loyalty' ||
          this.skill?.attributes.includes(key as AttributeName)
      )
      .map(([, value]) => value);
  }

  get die() {
    if (this.dice.length === 0) {
      return 0;
    } else if (Level[this.skill.level] < 0 || this.direction < 0) {
      return Math.min(...this.dice.value);
    } else {
      return Math.max(...this.dice.value);
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
    } else if (this.manuallyRolling) {
      return 'manuallyRolling';
    } else {
      return 'finalizing';
    }
  }

  get skillLevel(): number {
    if (!this.skill) {
      return null;
    }
    return Level[this.skill?.level] + (this.roll.skillModifier || 0);
  }

  get skillModifierDescription() {
    if (this.roll.skillModifier >= 0) {
      return `${this.roll.skillModifier} asset${
        this.roll.skillModifier === 1 ? '' : 's'
      }`;
    } else if (this.roll.skillModifier < 0) {
      return `${this.roll.skillModifier} hindrance${
        this.roll.skillModifier === -1 ? '' : 's'
      }`;
    } else {
      return '';
    }
  }

  async selectAttribute(event: MatSelectChange) {
    this.attribute = this.data.character.attributes[event.value];
    const rollPreference = await this.userService.getRollPreference();
    if (rollPreference === 'manual') {
      this.manualRoll();
    } else if (rollPreference === 'automatic') {
      this.autoRoll();
    }
  }

  async selectSkill(event: MatSelectChange) {
    this._chosenSkill = this.data.character.skills.filter(
      (skill) => skill.id === event.value
    )[0];
    if (this.attributes.length === 1) {
      this.selectAttribute({ ...event, value: this.attributes[0].name });
    }
  }

  incrementEffort() {
    this.rollState
      .get('effort')
      .patchValue(
        Math.min(this.attribute.current, this.rollState.get('effort').value + 1)
      );
    this.rollState.get('effort').markAsDirty();
  }

  decrementEffort() {
    this.rollState
      .get('effort')
      .patchValue(Math.max(0, this.rollState.get('effort').value - 1));
    this.rollState.get('effort').markAsDirty();
  }

  autoRoll() {
    const diceCount = Math.abs(this.skillLevel) + 1;
    const dice = new Array(diceCount)
      .fill(0)
      .map((v) => Math.floor(Math.random() * 12) + 1);
    this.setDice(dice);
  }

  manualRoll() {
    const diceCount = Math.abs(this.skillLevel) + 1;
    const dice = new Array(diceCount).fill(0);
    this.manuallyRolling = true;
    this.setDice(dice);
    this.dice.controls.forEach((d) => d.markAsDirty());
  }

  setDice(dice: number[]) {
    dice.forEach((die) =>
      (this.rollState.get('dice') as FormArray).push(
        new FormControl(die, [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
        ])
      )
    );
    this.dice.markAllAsTouched();
  }

  acceptManualRoll() {
    this.manuallyRolling = false;
  }

  get total() {
    return Math.max(
      this.die + (this.effort.value + this.attribute.edge) * this.direction,
      1
    );
  }

  setRoll() {}

  finalize() {
    const result = {
      ...this.data.roll,
      dice: this.dice.value,
      die: this.die,
      skill: this.skill,
      attribute: this.attribute,
      effort: this.effort.value,
      state: 'rolled',
    };
    this.matDialogRef.close(result);
  }
}

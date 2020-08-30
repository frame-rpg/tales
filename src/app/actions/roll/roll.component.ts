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
import { Roll, RolledRoll, RequestedRoll } from 'types/event';
import { CharacterSkill } from 'types/skill';
import { Level } from 'types/enums';
import { Attribute } from 'types/attribute';

export interface InjectedData {
  skills: CharacterSkill[];
  attributes: Attribute[];
  character: SkilledCharacter;
  roll: Roll;
}

@Component({
  selector: 'roll-dialog',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.scss'],
})
export class RollComponent implements OnInit, OnDestroy {
  rollState = new FormGroup(
    {
      target: new FormControl('open'),
      dice: new FormArray([]),
      baseInitiative: new FormControl(0),
      effort: new FormControl(0, [
        Validators.min(0),
        (e) => this.validateEffort(e),
      ]),
    },
    () => this.validate()
  );
  manuallyRolling = false;
  skill: CharacterSkill;
  attribute: Attribute;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InjectedData,
    public matDialogRef: MatDialogRef<RollComponent>
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
    } else if (Level[this.skill.level] < 0 || this.direction < 0) {
      return Math.min(...this.dice.value);
    } else {
      return Math.max(...this.dice.value);
    }
  }

  get direction() {
    if (this.skill && this.skill.type === 'initiative') {
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

  selectAttribute(attribute: Attribute) {
    this.attribute = attribute;
  }

  selectSkill(skill: CharacterSkill) {
    this.skill = skill;
    if (this.attributes.length === 1) {
      this.attribute = this.attributes[0];
    }
  }

  autoRoll() {
    const diceCount = Math.abs(Level[this.skill.level]) + 1;
    const dice = new Array(diceCount)
      .fill(0)
      .map((v) => Math.floor(Math.random() * 12) + 1);
    this.roll(dice);
  }

  manualRoll() {
    const diceCount = Math.abs(Level[this.skill.level]) + 1;
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
    const result: RolledRoll = {
      ...(this.data.roll as RequestedRoll),
      id: this.data.roll.id,
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

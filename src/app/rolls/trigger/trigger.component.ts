import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { SkilledCharacter } from 'types/character';
import { Weapon } from 'types/equipment';
import { SkillType } from 'types/skill';
import {
  countAssets,
  countCharacter,
  countEdge,
  countInitiative,
} from 'src/app/data/modifiers';

export interface TriggerData {
  character?: SkilledCharacter;
  type: SkillType;
}

interface Has {
  assets: boolean;
  damage: boolean;
  target: boolean;
  edge: boolean;
  weapon: boolean;
}

const typesHave: Record<SkillType, Has> = {
  defense: {
    assets: true,
    damage: true,
    target: true,
    edge: true,
    weapon: false,
  },
  attack: {
    assets: true,
    damage: true,
    target: true,
    edge: true,
    weapon: false,
  },
  health: {
    assets: true,
    damage: false,
    target: true,
    edge: true,
    weapon: false,
  },
  initiative: {
    assets: true,
    damage: false,
    target: false,
    edge: true,
    weapon: false,
  },
  noncombat: {
    assets: true,
    damage: false,
    target: true,
    edge: true,
    weapon: false,
  },
};

const possibleFormFields = {
  assets: {
    default: 0,
    validators: [Validators.pattern(/\-?[0-9]*/)],
    type: 'number',
  },
  edge: {
    default: 0,
    validators: [Validators.pattern(/\-?[0-9]*/)],
    type: 'number',
  },
  target: {
    default: 0,
    validators: [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ],
    type: 'number',
  },
  damage: { default: 0, validators: [], type: 'number' },
  weapon: { default: null, validators: [], type: 'string' },
};

@Component({
  selector: 'framesystem-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss'],
})
export class TriggerComponent {
  req: FormGroup;
  has: Has;
  chosenWeapon: Weapon;
  customMelee: Weapon;
  customRanged: Weapon;
  constructor(
    public matDialogRef: MatDialogRef<TriggerComponent>,
    @Inject(MAT_DIALOG_DATA) public trigger: TriggerData
  ) {
    this.has = typesHave[this.trigger.type];
    this.req = new FormGroup(
      Object.entries(possibleFormFields)
        .filter(([, present]) => present)
        .reduce(
          (acc, [id, field]) => ({
            ...acc,
            [id]: new FormControl(field.default, field.validators.concat()),
          }),
          {}
        )
    );
    if (this.has.weapon) {
      this.customMelee = {
        ...basicMelee,
        skills: this.trigger.character.skills
          .filter((skill) => skill.category === 'melee')
          .map((skill) => skill.skillId),
      };
      this.customRanged = {
        ...basicRanged,
        skills: this.trigger.character.skills
          .filter((skill) => skill.category === 'ranged')
          .map((skill) => skill.skillId),
      };
    }
  }

  ok() {
    const result = Object.entries(possibleFormFields)
      .filter(([, present]) => present)
      .reduce(
        (acc, [id, field]) => ({
          ...acc,
          [id]:
            field.type === 'number'
              ? parseInt(this.req.get(id).value, 10)
              : this.req.get(id).value,
        }),
        {}
      );

    this.matDialogRef.close(result);
  }

  weaponSelected(event: MatSelectChange) {
    this.req.patchValue({
      assets: countAssets(this.req.get('weapon').value, 'attack'),
      // countAssets(this.otherEquipment, 'attack'),
      edge: countEdge(this.req.get('weapon').value, 'attack'),
      // countEdge(this.otherEquipment, 'attack'),
      initiative:
        this.req.get('weapon').value.initiative +
        countInitiative(this.trigger.character),
      damage: this.req.get('weapon').value.damage,
    });
  }
}

const basicMelee: Omit<Weapon, 'skills'> = {
  type: 'weapon',
  kind: 'melee',
  initiative: 0,
  damage: 0,
  slot: 'other',
  equipped: false,
  size: 0,
  name: 'Custom Melee Weapon',
  effect: {},
};

const basicRanged: Omit<Weapon, 'skills'> = {
  type: 'weapon',
  kind: 'ranged',
  initiative: 0,
  damage: 0,
  slot: 'other',
  equipped: false,
  size: 0,
  name: 'Custom Ranged Weapon',
  effect: {},
};

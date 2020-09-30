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
import { RollRequest } from 'types/roll';

export interface RequestDialogData {
  character?: SkilledCharacter;
  weapon?: Weapon;
  type: SkillType;
}

interface Has {
  assets: boolean;
  damage: boolean;
  target: boolean;
  edge: boolean;
}

const typesHave: Record<SkillType, Has> = {
  defense: {
    assets: true,
    damage: true,
    target: true,
    edge: true,
  },
  attack: {
    assets: true,
    damage: true,
    target: true,
    edge: true,
  },
  health: {
    assets: true,
    damage: false,
    target: true,
    edge: true,
  },
  initiative: {
    assets: true,
    damage: false,
    target: false,
    edge: true,
  },
  noncombat: {
    assets: true,
    damage: false,
    target: true,
    edge: true,
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
};

function getDefault(field: string, weapon?: Weapon) {
  if (weapon && weapon[field]) {
    return weapon[field];
  } else {
    return possibleFormFields[field].default;
  }
}

@Component({
  selector: 'framesystem-request-roll',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent<R extends RollRequest> {
  req: FormGroup;
  has: Has;

  constructor(
    public matDialogRef: MatDialogRef<RequestComponent<R>, Partial<R>>,
    @Inject(MAT_DIALOG_DATA) public request: RequestDialogData
  ) {
    this.has = typesHave[this.request.type];
    this.req = new FormGroup(
      Object.entries(possibleFormFields)
        .filter(([, present]) => present)
        .reduce(
          (acc, [id, field]) => ({
            ...acc,
            [id]: new FormControl(getDefault(id), field.validators.concat()),
          }),
          {}
        )
    );
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
      ) as R;

    this.matDialogRef.close(result);
  }
}

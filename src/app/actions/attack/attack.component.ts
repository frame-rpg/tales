import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {
  countAssets,
  countCharacter,
  countEdge,
  countInitiative,
} from 'src/app/data/modifiers';
import { SkilledCharacter } from 'types/character';
import { Equipment, Weapon } from 'types/equipment';
import { Attack } from 'types/roll';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
})
export class AttackComponent implements OnInit {
  weapons: Weapon[];
  otherEquipment: Equipment[];
  chosenWeapon: Weapon;
  req = new FormGroup({
    assets: new FormControl(null, [Validators.pattern(/\-?[0-9]*/)]),
    target: new FormControl(null, [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ]),
    initiative: new FormControl(null, [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ]),
    damage: new FormControl(null),
    edge: new FormControl(null),
  });

  constructor(
    public matDialogRef: MatDialogRef<AttackComponent, Attack>,
    @Inject(MAT_DIALOG_DATA) public character: SkilledCharacter
  ) {
    this.weapons = this.character.equipment.filter(
      (item) => item.type === 'weapon' && item.equipped
    ) as Weapon[];
    this.otherEquipment = this.character.equipment.filter(
      (item) => item.type !== 'weapon' && item.equipped
    );
  }

  ok() {
    const response: Attack = {
      type: 'attack',
      edge: parseInt(this.req.value.edge, 10) || 0,
      assets: parseInt(this.req.value.assets, 10) || 0,
      damage: parseInt(this.req.value.damage, 10) || 0,
      target: parseInt(this.req.value.target, 10) || 0,
      initiative: parseInt(this.req.value.initiative, 10) || 0,
      skills: this.chosenWeapon.skills.concat(),
      items: [this.chosenWeapon],
    };
    this.matDialogRef.close(response);
  }

  weaponSelected(event: MatSelectChange) {
    if (event?.value?.type === 'weapon') {
      this.chosenWeapon = event.value;
    } else if (event?.value === 'custom-melee') {
      this.chosenWeapon = {
        type: 'weapon',
        kind: 'melee',
        skills: this.character.skills
          .filter((skill) => skill.category === 'melee')
          .map((skill) => skill.skillId),
        initiative: 0,
        damage: 0,
        slot: 'other',
        equipped: false,
        size: 0,
        name: 'Custom Melee Weapon',
        effect: {},
      };
    } else if (event?.value === 'custom-ranged') {
      this.chosenWeapon = {
        type: 'weapon',
        kind: 'ranged',
        skills: this.character.skills
          .filter((skill) => skill.category === 'ranged')
          .map((skill) => skill.skillId),
        initiative: 0,
        damage: 0,
        slot: 'other',
        equipped: false,
        size: 0,
        name: 'Custom Ranged Weapon',
        effect: {},
      };
    }
    this.req.patchValue({
      assets:
        countAssets(this.chosenWeapon, 'attack') +
        countAssets(this.otherEquipment, 'attack'),
      edge:
        countEdge(this.chosenWeapon, 'attack') +
        countEdge(this.otherEquipment, 'attack'),
      initiative:
        this.chosenWeapon.initiative + countInitiative(this.character),
      damage: this.chosenWeapon.damage,
    });
  }

  ngOnInit(): void {}
}

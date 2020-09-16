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
    assets: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
    target: new FormControl(0, [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ]),
    initiative: new FormControl(0, [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ]),
    damage: new FormControl(0),
    edge: new FormControl(0),
  });

  constructor(
    public matDialogRef: MatDialogRef<AttackComponent>,
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
    const response = {
      modifier: parseInt(this.req.value.modifier, 10),
      damage: parseInt(this.req.value.damage, 10),
      target: parseInt(this.req.value.target, 10),
      initiative: parseInt(this.req.value.initiative, 10),
      weapon: this.chosenWeapon,
      otherItems: countCharacter(this.character, 'attack').relevant.filter(
        (e) => e.type !== 'weapon'
      ),
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

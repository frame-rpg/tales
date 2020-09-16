import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkilledCharacter } from 'types/character';

@Component({
  selector: 'tales-noncombat',
  templateUrl: './noncombat.component.html',
  styleUrls: ['./noncombat.component.scss'],
})
export class NoncombatComponent implements OnInit {
  req = new FormGroup({
    assets: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
    target: new FormControl(0, [Validators.pattern(/[0-9]*/)]),
    initiative: new FormControl(10, [Validators.pattern(/[0-9]*/)]),
    skills: new FormControl([]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public character: SkilledCharacter,
    public matDialogRef: MatDialogRef<NoncombatComponent>
  ) {}

  ngOnInit(): void {}

  get skills() {
    return this.character.skills
      .filter((skill) => skill.type === 'noncombat')
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  ok() {
    const response = {
      assets: parseInt(this.req.value.assets, 10),
      initiative: parseInt(this.req.value.initiative, 10),
      skills: this.req.value.skills,
    };
    if (parseInt(this.req.value.target, 10)) {
      response['target'] = parseInt(this.req.value.target, 10);
    }
    this.matDialogRef.close(response);
  }
}

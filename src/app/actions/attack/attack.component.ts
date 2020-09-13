import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
})
export class AttackComponent implements OnInit {
  req = new FormGroup({
    modifier: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
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
  });

  constructor(public matDialogRef: MatDialogRef<AttackComponent>) {}

  ok() {
    this.matDialogRef.close({
      modifier: parseInt(this.req.value.modifier, 10),
      damage: parseInt(this.req.value.damage, 10),
      target: parseInt(this.req.value.target, 10),
      initiative: parseInt(this.req.value.initiative, 10),
    });
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-defend',
  templateUrl: './defend.component.html',
  styleUrls: ['./defend.component.scss'],
})
export class DefendComponent {
  req = new FormGroup({
    modifier: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
    target: new FormControl(0, [
      Validators.pattern(/[0-9]*/),
      Validators.required,
      Validators.min(1),
    ]),
    damage: new FormControl(0),
  });
  constructor(public matDialogRef: MatDialogRef<DefendComponent>) {}
  ok() {
    this.matDialogRef.close({
      modifier: parseInt(this.req.value.modifier, 10),
      damage: parseInt(this.req.value.damage, 10),
      target: parseInt(this.req.value.target, 10),
    });
  }
}

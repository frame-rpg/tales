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
    assets: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
    edge: new FormControl(0, [Validators.pattern(/\-?[0-9]*/)]),
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
      assets: parseInt(this.req.value.assets, 10),
      damage: parseInt(this.req.value.damage, 10),
      target: parseInt(this.req.value.target, 10),
      edge: parseInt(this.req.value.edge, 10),
    });
  }
}

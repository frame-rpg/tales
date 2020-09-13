import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-initiative',
  templateUrl: './initiative.component.html',
  styleUrls: ['./initiative.component.scss'],
})
export class InitiativeComponent {
  modifier = new FormControl(0, [Validators.pattern(/\-?[0-9]/)]);

  constructor(public matDialogRef: MatDialogRef<InitiativeComponent>) {}

  ok() {
    this.matDialogRef.close({ modifier: parseInt(this.modifier.value, 10) });
  }
}

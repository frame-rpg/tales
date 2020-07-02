import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  constructor(public dialogRef: MatDialogRef<CreateComponent>) {}

  name: string;
  type = 'player';
  onCancel(): void {
    this.dialogRef.close();
  }
}

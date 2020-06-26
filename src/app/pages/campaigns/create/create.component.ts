import { Component, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  constructor(public dialogRef: MatDialogRef<CreateComponent>) {}

  description: string;
  name: string;
  onCancel(): void {
    this.dialogRef.close();
  }
}

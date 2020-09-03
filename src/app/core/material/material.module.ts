import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
  ],
})
export class MaterialModule {}

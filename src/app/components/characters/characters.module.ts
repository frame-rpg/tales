import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardComponent, CreateComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    RouterModule,
    RouterModule,
  ],
  exports: [CardComponent, CreateComponent],
})
export class CharactersModule {}

import { CharactersRoutingModule } from '../characters/characters-routing.module';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DetailComponent, ListComponent],
  imports: [
    CharactersRoutingModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
  ],
})
export class CharactersModule {}

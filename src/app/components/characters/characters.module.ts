import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardComponent, CreateComponent],
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  exports: [CardComponent, CreateComponent],
})
export class CharactersModule {}

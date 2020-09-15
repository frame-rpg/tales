import { ActionsModule } from 'src/app/actions/actions.module';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardComponent, CreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    PipesModule,
    ActionsModule,
  ],
  exports: [CardComponent, CreateComponent],
})
export class CharactersModule {}

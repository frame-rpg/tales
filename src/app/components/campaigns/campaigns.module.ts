import { ActionsModule } from 'src/app/actions/actions.module';
import { CharactersModule } from '../characters/characters.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { RollsModule } from 'src/app/rolls/rolls.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CharactersModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ActionsModule,
    RollsModule,
  ],
  exports: [],
})
export class CampaignsModule {}

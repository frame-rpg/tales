import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material/material.module';
import { NgModule } from '@angular/core';
import { PipesModule } from '../core/pipes/pipes.module';
import { TriggerComponent } from './trigger/trigger.component';

@NgModule({
  declarations: [TriggerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule,
  ],
})
export class RollsModule {}

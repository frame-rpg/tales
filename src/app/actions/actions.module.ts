import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdjustComponent } from './adjust/adjust.component';
import { AttackComponent } from './attack/attack.component';
import { CommonModule } from '@angular/common';
import { InitiativeComponent } from './initiative/initiative.component';
import { MaterialModule } from '../core/material/material.module';
import { NgModule } from '@angular/core';
import { PipesModule } from '../core/pipes/pipes.module';

@NgModule({
  declarations: [AttackComponent, InitiativeComponent, AdjustComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [AdjustComponent],
})
export class ActionsModule {}

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AttackComponent } from './attack/attack.component';
import { CommonModule } from '@angular/common';
import { InitiativeComponent } from './initiative/initiative.component';
import { MaterialModule } from '../core/material/material.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AttackComponent, InitiativeComponent],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
})
export class ActionsModule {}

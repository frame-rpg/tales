import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { PanelComponent } from './panel/panel.component';
import { ResolveComponent } from './resolve/resolve.component';

@NgModule({
  declarations: [ResolveComponent, PanelComponent],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [ResolveComponent, PanelComponent],
})
export class RollModule {}

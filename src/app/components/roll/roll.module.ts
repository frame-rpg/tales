import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PanelComponent } from './panel/panel.component';
import { ResolveComponent } from './resolve/resolve.component';

@NgModule({
  declarations: [ResolveComponent, PanelComponent],
  imports: [CommonModule],
  exports: [ResolveComponent, PanelComponent],
})
export class RollModule {}

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { PanelComponent } from './panel/panel.component';
import { ResolveComponent } from './resolve/resolve.component';

@NgModule({
  declarations: [ResolveComponent, PanelComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule],
  exports: [ResolveComponent, PanelComponent],
})
export class RollModule {}

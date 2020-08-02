import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { PanelComponent } from './panel/panel.component';
import { ResolveComponent } from './resolve/resolve.component';

@NgModule({
  declarations: [ResolveComponent, PanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
  ],
  exports: [ResolveComponent, PanelComponent],
})
export class RollModule {}

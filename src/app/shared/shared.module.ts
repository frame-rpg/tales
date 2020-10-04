import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { ImageSelectComponent } from './image-select.component';

@NgModule({
  declarations: [SpinnerComponent, ImageSelectComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [SpinnerComponent],
})
export class SharedModule {}

import { CommonModule } from '@angular/common';
import { ImageSelectComponent } from './image-select/image-select.component';
import { MaterialModule } from '../core/material/material.module';
import { NgModule } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [SpinnerComponent, ImageSelectComponent],
  imports: [CommonModule, MaterialModule, NgxFileDropModule],
  exports: [SpinnerComponent],
})
export class SharedModule {}

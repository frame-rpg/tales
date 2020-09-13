import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrackByPropertyPipe } from './trackbyproperty.pipe';

@NgModule({
  declarations: [TrackByPropertyPipe],
  imports: [CommonModule],
  exports: [TrackByPropertyPipe],
})
export class PipesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkillsortPipe } from './skillsort.pipe';
import { TrackByPropertyPipe } from './trackbyproperty.pipe';

@NgModule({
  declarations: [TrackByPropertyPipe, SkillsortPipe],
  imports: [CommonModule],
  exports: [TrackByPropertyPipe, SkillsortPipe],
})
export class PipesModule {}

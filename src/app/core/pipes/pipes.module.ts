import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkillsortPipe } from './skillsort.pipe';
import { SortByPipe } from './sort-by.pipe';
import { TrackByPropertyPipe } from './trackbyproperty.pipe';

@NgModule({
  declarations: [TrackByPropertyPipe, SkillsortPipe, SortByPipe],
  imports: [CommonModule],
  exports: [TrackByPropertyPipe, SkillsortPipe, SortByPipe],
})
export class PipesModule {}

import { CommonModule } from '@angular/common';
import { DetailComponent } from '../campaigns/detail/detail.component';
import { ListComponent } from '../campaigns/list/list.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, DetailComponent, ListComponent],
})
export class CharactersModule {}

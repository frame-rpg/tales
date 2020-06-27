import { CharactersRoutingModule } from '../characters/characters-routing.module';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DetailComponent, ListComponent],
  imports: [CommonModule, CharactersRoutingModule],
})
export class CharactersModule {}

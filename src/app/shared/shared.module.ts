import { CharacterCardComponent } from './character-card/character-card.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CharacterCardComponent],
  imports: [CommonModule, CharacterCardComponent],
})
export class SharedModule {}

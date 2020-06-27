import { CharacterCardComponent } from './character-card/character-card.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CharacterCardComponent],
  imports: [CommonModule, MatCardModule],
})
export class SharedModule {}

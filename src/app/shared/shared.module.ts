import { CharacterCardComponent } from './character-card/character-card.component';
import { CharacterModule } from './character/character.module';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CharacterCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CharacterModule,
  ],
  exports: [CharacterCardComponent],
})
export class SharedModule {}

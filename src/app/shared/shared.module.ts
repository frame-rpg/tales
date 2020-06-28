import { CharacterCardComponent } from './character-card/character-card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { PlayerCardComponent } from './character-card/player-card.component';
import { RouterModule } from '@angular/router';
import { SkillBlockComponent } from './character-card/skill-block.component';

@NgModule({
  declarations: [
    CharacterCardComponent,
    PlayerCardComponent,
    SkillBlockComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  exports: [CharacterCardComponent],
})
export class SharedModule {}

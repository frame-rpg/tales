import { AttributesComponent } from './attributes/attributes.component';
import { CommonModule } from '@angular/common';
import { CompanionComponent } from './companion/companion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { NonplayerComponent } from './nonplayer/nonplayer.component';
import { PlayerComponent } from './player/player.component';
import { RouterModule } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
  declarations: [
    AttributesComponent,
    PlayerComponent,
    NonplayerComponent,
    CompanionComponent,
    SkillsComponent,
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  exports: [
    AttributesComponent,
    PlayerComponent,
    NonplayerComponent,
    CompanionComponent,
    SkillsComponent,
  ],
})
export class CharacterModule {}

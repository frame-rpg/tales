import { AttributesComponent } from './attributes/attributes.component';
import { CommonModule } from '@angular/common';
import { CompanionComponent } from './companion/companion.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { NonplayerComponent } from './nonplayer/nonplayer.component';
import { PlayerComponent } from './player/player.component';
import { RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
  declarations: [
    AttributesComponent,
    PlayerComponent,
    NonplayerComponent,
    CompanionComponent,
    SkillsComponent,
    SheetComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatExpansionModule,
  ],
  exports: [
    AttributesComponent,
    PlayerComponent,
    NonplayerComponent,
    CompanionComponent,
    SkillsComponent,
    SheetComponent,
  ],
})
export class CharacterModule {}

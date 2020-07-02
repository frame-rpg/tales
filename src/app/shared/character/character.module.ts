import { AttributesComponent } from './attributes/attributes.component';
import { CommonModule } from '@angular/common';
import { CompanionComponent } from './companion/companion.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
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

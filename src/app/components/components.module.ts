import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RollModule } from './roll/roll.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [CharactersModule, CampaignsModule, RollModule],
})
export class ComponentsModule {}

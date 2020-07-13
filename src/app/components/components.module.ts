import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [CharactersModule, CampaignsModule],
})
export class ComponentsModule {}

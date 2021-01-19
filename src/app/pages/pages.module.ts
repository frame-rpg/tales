import { CampaignComponent } from './campaign/campaign.component';
import { CharacterComponent } from './character/character.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material/material.module';
import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [CampaignComponent, CharacterComponent, UserComponent],
  imports: [CommonModule, MaterialModule],
})
export class PagesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign/campaign.component';
import { CharacterComponent } from './character/character.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [CampaignComponent, CharacterComponent, UserComponent],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }

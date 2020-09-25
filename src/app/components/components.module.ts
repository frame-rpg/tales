import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { PagesModule } from './pages/pages.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    CharactersModule,
    CampaignsModule,
    HomeModule,
    PagesModule,
    UserModule,
  ],
})
export class ComponentsModule {}

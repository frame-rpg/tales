import { ActionsModule } from 'src/app/actions/actions.module';
import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CharactersModule } from '../characters/characters.module';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { GmviewComponent } from './gmview/gmview.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { PlayerviewComponent } from './playerview/playerview.component';

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    PlayerviewComponent,
    GmviewComponent,
  ],
  imports: [
    CampaignsRoutingModule,
    CharactersModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ActionsModule,
  ],
  exports: [CreateComponent, ListComponent],
})
export class CampaignsModule {}

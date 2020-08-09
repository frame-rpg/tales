import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CharactersModule } from '../characters/characters.module';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { RollModule } from '../roll/roll.module';

@NgModule({
  declarations: [CreateComponent, ListComponent, DetailComponent],
  imports: [
    CampaignsRoutingModule,
    CharactersModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    RollModule,
  ],
  exports: [CreateComponent, ListComponent, DetailComponent],
})
export class CampaignsModule {}

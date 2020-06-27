import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    CreateComponent,
    DetailComponent,
    ListComponent,
  ],
})
export class CampaignsModule {}

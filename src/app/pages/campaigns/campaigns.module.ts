import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateComponent, ListComponent, DetailComponent],
  imports: [
    CampaignsRoutingModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatInputModule,
    SharedModule,
    MatIconModule,
  ],
})
export class CampaignsModule {}

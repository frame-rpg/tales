import { RouterModule, Routes } from '@angular/router';

import { GmviewComponent } from './gmview/gmview.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { PlayerviewComponent } from './playerview/playerview.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: ':id/gm', component: GmviewComponent },
  { path: ':id/player', component: PlayerviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsRoutingModule {}

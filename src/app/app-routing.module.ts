import { RouterModule, Routes } from '@angular/router';

import { GmviewComponent } from './components/campaigns/gmview/gmview.component';
import { NgModule } from '@angular/core';
import { PlayerviewComponent } from './components/campaigns/playerview/playerview.component';
import { RouteComponent } from './components/home/route.component';

const routes: Routes = [
  {
    path: 'campaigns/:campaignId/gm',
    pathMatch: 'full',
    component: GmviewComponent,
  },
  {
    path: 'campaigns/:campaignId/player',
    pathMatch: 'full',
    component: PlayerviewComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: RouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

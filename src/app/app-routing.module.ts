import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { GmviewComponent } from './components/campaigns/gmview/gmview.component';
import { NgModule } from '@angular/core';
import { PlayerviewComponent } from './components/campaigns/playerview/playerview.component';
import { RouteComponent } from './components/home/route.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'campaigns/:campaignId/gm',
    pathMatch: 'full',
    component: GmviewComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'campaigns/:campaignId/player',
    pathMatch: 'full',
    component: PlayerviewComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '',
    pathMatch: 'full',
    component: RouteComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

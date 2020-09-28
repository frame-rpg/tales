import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { ViewComponent as CampaignViewComponent } from './components/campaigns/view/view.component';
import { RouteComponent as HomeRouteComponent } from './components/home/route.component';
import { LoginComponent } from './components/user/login.component';
import { NgModule } from '@angular/core';
import { RulesComponent } from './components/pages/static/rules.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

function redirectUnauthorizedToLogin(after: string) {
  return () => redirectUnauthorizedTo(['login', after]);
}

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'campaigns/:campaignId',
    component: CampaignViewComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin('campaigns') },
  },
  {
    path: 'home',
    component: HomeRouteComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin('home') },
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [{ path: ':after', component: LoginComponent }],
  },
  { path: 'rules', component: RulesComponent },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

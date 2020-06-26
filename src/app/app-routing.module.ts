import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent as CharactersListComponent } from './pages/characters/list/list.component';
import { DetailComponent as CharactersDetailComponent } from './pages/characters/detail/detail.component';
import { ListComponent as CampaignsListComponent } from './pages/campaigns/list/list.component';
import { DetailComponent as CampaignsDetailComponent } from './pages/campaigns/detail/detail.component';
const routes: Routes = [
  {
    path: 'characters',
    component: CharactersListComponent,
  },
  {
    path: 'characters/:id',
    component: CharactersDetailComponent,
  },
  {
    path: 'campaigns',
    component: CampaignsListComponent,
  },
  {
    path: 'campaigns/:id',
    component: CampaignsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

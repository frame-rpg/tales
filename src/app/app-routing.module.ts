import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'characters',
    loadChildren: () =>
      import('./pages/characters/characters.module').then(
        (m) => m.CharactersModule
      ),
  },
  {
    path: 'campaigns',
    loadChildren: () =>
      import('./pages/campaigns/campaigns.module').then(
        (m) => m.CampaignsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

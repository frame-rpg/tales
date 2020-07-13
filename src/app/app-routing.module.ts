import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'campaigns',
    loadChildren: () =>
      import('./components/campaigns/campaigns.module').then(
        (m) => m.CampaignsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

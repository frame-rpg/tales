import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './pages/characters/list/list.component';
import { DetailComponent } from './pages/characters/detail/detail.component';
const routes: Routes = [
  {
    path: 'characters',
    component: ListComponent,
  },
  {
    path: 'characters/:id',
    component: DetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

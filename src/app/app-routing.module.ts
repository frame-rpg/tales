import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { CharacterListComponent } from './character-list/character-list.component';
const routes: Routes = [
  {
    path: 'characters',
    component: CharacterListComponent,
  },
  {
    path: 'characters/:id',
    component: CharacterDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

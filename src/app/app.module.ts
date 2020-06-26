import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { ListComponent as CharactersListComponent } from './pages/characters/list/list.component';
import { DetailComponent as CharactersDetailComponent } from './pages/characters/detail/detail.component';
import { ListComponent as CampaignsListComponent } from './pages/campaigns/list/list.component';
import { DetailComponent as CampaignsDetailComponent } from './pages/campaigns/detail/detail.component';
import { DetailComponent as ScenesDetailComponent } from './pages/scenes/detail/detail.component';
import { CreateComponent } from './pages/campaigns/create/create.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CharactersListComponent,
    CharactersDetailComponent,
    CampaignsListComponent,
    CampaignsDetailComponent,
    ScenesDetailComponent,
    CreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCPMpyIIJ5kEz6baDWs8FlGN9zZ-DhttEU',
      authDomain: 'tales-280319.firebaseapp.com',
      databaseURL: 'https://tales-280319.firebaseio.com',
      projectId: 'tales-280319',
      storageBucket: 'tales-280319.appspot.com',
      messagingSenderId: '566075741185',
      appId: '1:566075741185:web:5ab6e5b64399c8165edc00',
      measurementId: 'G-Q6Z05NHF7L',
    }),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

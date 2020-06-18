import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { CharacterListComponent } from './character-list/character-list.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CharacterDetailComponent,
    CharacterListComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

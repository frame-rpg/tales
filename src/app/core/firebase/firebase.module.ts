import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  providers: [],
  imports: [
    AngularFireAuthModule,
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
    CommonModule,
  ],
})
export class FirebaseModule {}

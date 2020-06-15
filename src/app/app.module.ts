import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './admin/login/login.component';
import { RegisterComponent } from './admin/register/register.component';
import { ForgotPasswordComponent } from './admin/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './admin/verify-email/verify-email.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCPMpyIIJ5kEz6baDWs8FlGN9zZ-DhttEU",
      authDomain: "tales-280319.firebaseapp.com",
      databaseURL: "https://tales-280319.firebaseio.com",
      projectId: "tales-280319",
      storageBucket: "tales-280319.appspot.com",
      messagingSenderId: "566075741185",
      appId: "1:566075741185:web:5ab6e5b64399c8165edc00",
      measurementId: "G-Q6Z05NHF7L",
    }),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

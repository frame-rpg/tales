import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActionsModule } from './actions/actions.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './core/material/material.module';
import { NgModule } from '@angular/core';

const firebaseUiAuthConfig: any = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: true,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    CoreModule,
    MaterialModule,
    ActionsModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

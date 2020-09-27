import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FirebaseUIModule } from 'firebaseui-angular';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    FirebaseUIModule.forFeature({}),
  ],
})
export class UserModule {}

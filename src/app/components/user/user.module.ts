import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FirebaseUIModule } from 'firebaseui-angular';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [LoginComponent, HomeComponent, ViewComponent, EditComponent],
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

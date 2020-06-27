import { CommonModule } from '@angular/common';
import { FirebaseModule } from './firebase/firebase.module';
import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, FirebaseModule],
})
export class CoreModule {}

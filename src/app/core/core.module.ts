import { CommonModule } from '@angular/common';
import { DiceService } from './random/dice/dice.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, FirebaseModule],
})
export class CoreModule {}

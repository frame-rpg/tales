import { CommonModule } from '@angular/common';
import { DiceService } from './random/dice/dice.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NgModule } from '@angular/core';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FirebaseModule, PipesModule],
})
export class CoreModule {}

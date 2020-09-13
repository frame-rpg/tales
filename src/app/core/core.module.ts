import { CommonModule } from '@angular/common';
import { DiceService } from './random/dice/dice.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NgModule } from '@angular/core';
import { TrackbyPipe } from './pipes/trackby.pipe';

@NgModule({
  declarations: [TrackbyPipe],
  imports: [CommonModule, FirebaseModule],
})
export class CoreModule {}

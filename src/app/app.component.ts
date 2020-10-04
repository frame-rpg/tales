import { Component } from '@angular/core';
import { PresenceService } from './core/firebase/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Framesystem';
  constructor(private presence: PresenceService) {
    this.presence.getPresences().subscribe((v) => console.log(v));
  }
}

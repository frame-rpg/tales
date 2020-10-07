import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'types/user';
import { UserService } from 'src/app/components/user/user.service';

@Component({
  selector: 'framesystem-topline',
  templateUrl: './topline.component.html',
  styleUrls: ['./topline.component.scss'],
})
export class ToplineComponent implements OnInit {
  loggedIn: Observable<boolean>;
  user: Observable<User>;
  notifications: Observable<string[]>;
  title = of('Framesystem Roleplaying');

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.user.pipe(
      switchMap((u) => (!!u ? this.userService.get(u.uid) : of(null))),
      publishReplay(1),
      refCount()
    );
    this.loggedIn = this.user.pipe(map((u) => u !== null));
    this.notifications = of(['one', 'two', 'three']);
  }
}

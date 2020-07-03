import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './data/user.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tales';
  constructor(
    public auth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService
  ) {}
  async login() {
    await this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    await this.userService.postLogin();
  }
  logout() {
    this.auth.signOut();
  }
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}

import { BehaviorSubject, Observable } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './components/user/user.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tales';
  authAction_ = new BehaviorSubject<string>('choose');
  authAction = this.authAction_.asObservable();
  hidePassword = true;
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.email, Validators.required]),
  });
  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(public auth: AngularFireAuth, private userService: UserService) {}
  logout() {
    this.userService.logout();
  }
}

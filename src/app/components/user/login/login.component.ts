import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseuiAngularLibraryComponent } from 'firebaseui-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'tales-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('login') login: FirebaseuiAngularLibraryComponent;
  destroyingSubject = new BehaviorSubject<boolean>(false);
  destroying = this.destroyingSubject.asObservable().pipe(filter((v) => v));

  constructor(
    public auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async loginWithGoogle() {
    await this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    await this.userService.postLogin();
    this.router.navigateByUrl('/');
  }

  ngAfterViewInit() {
    this.login.signInSuccessWithAuthResultCallback
      .pipe(takeUntil(this.destroyingSubject))
      .subscribe(async (result) => {
        await this.userService.postLogin();
        this.snackBar.open('Successfully logged in.');
        this.router.navigateByUrl('/');
      });
    this.login.signInFailureCallback
      .pipe(takeUntil(this.destroyingSubject))
      .subscribe(async (result) => {
        this.snackBar.open('Login error.');
      });
  }

  ngOnDestroy() {
    this.destroyingSubject.next(true);
  }

  logout() {
    this.auth.signOut();
  }

  async verify() {
    (await this.auth.currentUser).sendEmailVerification();
    this.snackBar.open('Email sent.');
  }
}

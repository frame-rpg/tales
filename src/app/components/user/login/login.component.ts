import { BehaviorSubject, Observable } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../../data/user.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'tales-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  title = 'tales';
  authAction_ = new BehaviorSubject<string>('choose');
  authAction = this.authAction_.asObservable();
  hidePassword = true;
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.email, Validators.required]),
  });
  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(
    public auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) {}
  async loginWithGoogle() {
    await this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    await this.userService.postLogin();
    this.router.navigateByUrl('/');
  }
  logout() {
    this.auth.signOut();
  }
  emailAuth() {
    this.authAction_.next('login');
  }
  emailCreate() {
    this.authAction_.next('create');
  }
  offerReset() {
    this.authAction_.next('reset');
  }
  async signup() {
    await this.auth
      .createUserWithEmailAndPassword(
        this.passwordForm.get('username').value,
        this.passwordForm.get('password').value
      )
      .catch(({ message, code }) => {
        if (code === 'auth/email-already-in-use') {
          this.snackBar.open('Email in use already.');
        } else if (code === 'auth/invalid-email') {
          this.snackBar.open('That is not an email.');
        } else if (code === 'auth/operation-not-allowed') {
          this.snackBar.open('Something strange happened. Please tell Eric.');
        } else if (code === 'auth/weak-password') {
          this.snackBar.open('Your password is too weak. Try again.');
        } else {
          this.snackBar.open(
            `Something weird happened. Please tell Eric: ${code}`
          );
          console.log(message, code);
        }
        this.passwordForm.patchValue({ username: '', password: '' });
      });
  }

  async loginWithPassword() {
    await this.auth
      .signInWithEmailAndPassword(
        this.passwordForm.get('username').value,
        this.passwordForm.get('password').value
      )
      .catch(() => {
        this.snackBar.open('Log in error. Try again.');
        this.passwordForm.patchValue({ username: '', password: '' });
      });
    await this.userService.postLogin();
    this.router.navigateByUrl('/');
  }

  async verify() {
    (await this.auth.currentUser).sendEmailVerification();
    this.snackBar.open('Email sent.');
  }

  async resetPassword() {
    await this.auth
      .sendPasswordResetEmail(this.passwordForm.get('username').value)
      .catch(({ message, code }) => {
        console.log(message, code);
        if (code === 'auth/invalid-email') {
          this.snackBar.open('That is not an email.');
        } else if (code === 'auth/invalid-email') {
          this.snackBar.open('That email is not in our records.');
        } else {
          this.snackBar.open(
            'There was an error with your reset, try again later.'
          );
        }
      });
    this.snackBar.open('Password reset email sent.');
  }
}

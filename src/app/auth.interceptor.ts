import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      mergeMap((token: string) => {
        if (token) {
          return next.handle(
            request.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            })
          );
        } else {
          return next.handle(request);
        }
      })
    );
  }
}

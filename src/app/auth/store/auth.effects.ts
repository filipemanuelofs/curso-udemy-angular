import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

const USER_DATA = 'USER_DATA';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  localId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, localId, token, expirationDate);
  localStorage.setItem(USER_DATA, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccessAction({
    email,
    localId,
    token,
    tokenExpirationDate: expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFailAction(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(new AuthActions.AuthenticateFailAction(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.ActionTypes.SignupStart),
    switchMap((action: AuthActions.SignupStartAction) => {
      return this.http
        .post<AuthResponse>(
          environment.firebaseSignUpURL + environment.firebaseAPIKey,
          {
            email: action.payload.email,
            password: action.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((response) => {
            this.authService.autoLogOut(+response.expiresIn * 1000);
          }),
          map((response) => {
            return handleAuthentication(
              response.email,
              response.localId,
              response.idToken,
              +response.expiresIn
            );
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.ActionTypes.LoginStart),
    switchMap((action: AuthActions.LoginStartAction) => {
      return this.http
        .post<AuthResponse>(
          environment.firebaseLoginURL + environment.firebaseAPIKey,
          {
            email: action.payload.email,
            password: action.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap((response) => {
            this.authService.autoLogOut(+response.expiresIn * 1000);
          }),
          map((response) => {
            return handleAuthentication(
              response.email,
              response.localId,
              response.idToken,
              +response.expiresIn
            );
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.ActionTypes.AuthenticateSuccess),
    tap((authAction: AuthActions.AuthenticateSuccessAction) => {
      if (authAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.ActionTypes.AutoLogin),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem(USER_DATA));

      if (!userData) {
        return { type: 'DUMMY' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.autoLogOut(expirationDuration);

        return new AuthActions.AuthenticateSuccessAction({
          email: loadedUser.email,
          localId: loadedUser.localId,
          token: loadedUser.token,
          tokenExpirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        });
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.ActionTypes.Logout),
    tap(() => {
      this.authService.clearLogOutTimeout();
      localStorage.removeItem(USER_DATA);
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}

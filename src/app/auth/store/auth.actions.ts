import { Action } from '@ngrx/store';

export enum ActionTypes {
  LoginStart = '[Auth] Login start',
  AuthenticateFail = '[Auth] Login failed',
  AuthenticateSuccess = '[Auth] Login',
  SignupStart = '[Auth] Signup start',
  Logout = '[Auth] Logout',
  AutoLogin = '[Auth] Auto login',
  ClearError = '[Auth] Clear error',
}

export class LoginStartAction implements Action {
  readonly type = ActionTypes.LoginStart;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFailAction implements Action {
  readonly type = ActionTypes.AuthenticateFail;

  constructor(public payload: string) {}
}

export class SignupStartAction implements Action {
  readonly type = ActionTypes.SignupStart;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateSuccessAction implements Action {
  readonly type = ActionTypes.AuthenticateSuccess;

  constructor(
    public payload: {
      email: string;
      localId: string;
      token: string;
      tokenExpirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class LogoutAction implements Action {
  readonly type = ActionTypes.Logout;

  constructor() {}
}

export class ClearErrorAction implements Action {
  readonly type = ActionTypes.ClearError;

  constructor() {}
}

export class AutoLoginAction implements Action {
  readonly type = ActionTypes.AutoLogin;

  constructor() {}
}

export type AuthActions =
  | AuthenticateSuccessAction
  | LogoutAction
  | LoginStartAction
  | AuthenticateFailAction
  | SignupStartAction
  | ClearErrorAction
  | AutoLoginAction;

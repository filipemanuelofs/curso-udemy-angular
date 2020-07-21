import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import { LogoutAction } from './store/auth.actions';

const USER_DATA = 'USER_DATA';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.State>) {}

  autoLogOut(duration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new LogoutAction());
    }, duration);
  }

  clearLogOutTimeout() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}

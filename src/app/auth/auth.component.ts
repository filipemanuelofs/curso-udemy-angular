import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.valid) {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;

      if (this.isLoginMode) {
        this.store.dispatch(AuthActions.loginStart({ email, password }));
      } else {
        this.store.dispatch(AuthActions.signupStart({ email, password }));
      }

      this.authForm.reset();
    } else {
      this.error = 'The form is not valid!';
    }
  }

  onCloseAlert() {
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}

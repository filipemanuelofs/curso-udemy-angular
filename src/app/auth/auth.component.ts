import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import {
  LoginStartAction,
  SignupStartAction,
  ClearErrorAction,
} from './store/auth.actions';
import * as fromApp from '../store/app.reducer';

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
    private store: Store<fromApp.State>
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
      // this.isLoading = true;

      const email = this.authForm.value.email;
      const password = this.authForm.value.password;

      // let authObs: Observable<AuthResponse>;
      if (this.isLoginMode) {
        // authObs = this.authService.logIn(email, password);
        this.store.dispatch(
          new LoginStartAction({
            email,
            password,
          })
        );
      } else {
        // authObs = this.authService.signUp(email, password);
        this.store.dispatch(
          new SignupStartAction({
            email,
            password,
          })
        );
      }

      // authObs.subscribe(
      //   (response) => {
      //     this.isLoading = false;
      //     this.router.navigate(['/recipes']);
      //   },
      //   (error) => {
      //     console.error(error);
      //     this.error = error;
      //     this.isLoading = false;
      //   }
      // );

      this.authForm.reset();
    } else {
      this.error = 'The form is not valid!';
    }
  }

  onCloseAlert() {
    // this.error = null;
    this.store.dispatch(new ClearErrorAction());
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}

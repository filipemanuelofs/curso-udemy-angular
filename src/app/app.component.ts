import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import * as fromApp from './store/app.reducer';
import { AutoLoginAction } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.State>
  ) {}

  ngOnInit(): void {
    // this.authService.autoLogIn();
    this.store.dispatch(new AutoLoginAction());
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { LogoutAction } from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import {
  FetchRecipesAction,
  StoreRecipesAction,
} from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub: Subscription;

  constructor(
    // private dataStorageService: DataStorageService,
    // private authService: AuthService,
    private store: Store<fromApp.State>
  ) {}

  ngOnInit(): void {
    // this.userSub = this.authService.userBSubject.subscribe((user) => {
    this.userSub = this.store
      .select('auth')
      .pipe(
        map((authState) => {
          return authState.user;
        })
      )
      .subscribe((user) => {
        this.isAuthenticated = user ? true : false;
      });
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new StoreRecipesAction());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new FetchRecipesAction());
  }

  onLogout() {
    // this.authService.logOut();
    this.store.dispatch(new LogoutAction());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}

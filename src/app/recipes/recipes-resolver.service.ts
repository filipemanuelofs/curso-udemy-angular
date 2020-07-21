import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { FetchRecipesAction } from './store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.State>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    return this.store.select('recipe').pipe(
      take(1),
      map((recipeState) => {
        return recipeState.recipes;
      }),
      switchMap((recipes: Recipe[]) => {
        if (recipes.length === 0) {
          this.store.dispatch(new FetchRecipesAction());
          return this.actions$.pipe(
            ofType(RecipeActions.ActionTypes.SetRecipes),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}

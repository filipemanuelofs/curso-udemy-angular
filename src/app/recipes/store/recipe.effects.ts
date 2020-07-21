import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.ActionTypes.FetchRecipes),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        `${environment.firebaseDatabaseURL}/recipes.json`
      );
    }),
    map((recipes: Recipe[]) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes: Recipe[]) => {
      return new RecipeActions.SetRecipesAction(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.ActionTypes.StoreRecipes),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([recipeAction, recipeState]) => {
      return this.http.put(
        `${environment.firebaseDatabaseURL}/recipes.json`,
        recipeState.recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.State>
  ) {}
}

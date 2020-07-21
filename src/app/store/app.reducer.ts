import { ActionReducerMap } from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipe from '../recipes/store/recipe.reducer';

export interface State {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipe: fromRecipe.State;
}

export const reducer: ActionReducerMap<State> = {
  shoppingList: fromShoppingList.reducer,
  auth: fromAuth.reducer,
  recipe: fromRecipe.reducer,
};

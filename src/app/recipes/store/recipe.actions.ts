import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export enum ActionTypes {
  SetRecipes = '[Recipe] Set recipes',
  FetchRecipes = '[Recipe] Fetch recipes',
  AddRecipes = '[Recipe] Add recipes',
  UpdateRecipes = '[Recipe] Update recipes',
  DeleteRecipes = '[Recipe] Delete recipes',
  StoreRecipes = '[Recipe] Store recipes',
}

export class SetRecipesAction implements Action {
  readonly type = ActionTypes.SetRecipes;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipesAction implements Action {
  readonly type = ActionTypes.FetchRecipes;

  constructor() {}
}

export class AddRecipesAction implements Action {
  readonly type = ActionTypes.AddRecipes;

  constructor(public payload: Recipe) {}
}
export class UpdateRecipesAction implements Action {
  readonly type = ActionTypes.UpdateRecipes;

  constructor(public payload: { index: number; newRecipe: Recipe }) {}
}
export class DeleteRecipesAction implements Action {
  readonly type = ActionTypes.DeleteRecipes;

  constructor(public payload: number) {}
}

export class StoreRecipesAction implements Action {
  readonly type = ActionTypes.StoreRecipes;

  constructor() {}
}

export type RecipeActions =
  | SetRecipesAction
  | FetchRecipesAction
  | AddRecipesAction
  | UpdateRecipesAction
  | DeleteRecipesAction
  | StoreRecipesAction;

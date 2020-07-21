import { Action } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';

export enum ActionTypes {
  AddIngredient = '[Shopping List] Add ingredient',
  AddIngredients = '[Shopping List] Add ingredients',
  UpdateIngredient = '[Shopping List] Update ingredient',
  DeleteIngredient = '[Shopping List] Delete ingredient',
  StartEdit = '[Shopping List] Start edit',
  StopEdit = '[Shopping List] Stop edit',
}

export class AddIngredientAction implements Action {
  readonly type = ActionTypes.AddIngredient;

  constructor(public ingredient: Ingredient) {}
}

export class AddIngredientsAction implements Action {
  readonly type = ActionTypes.AddIngredients;

  constructor(public ingredients: Ingredient[]) {}
}

export class UpdateIngredientAction implements Action {
  readonly type = ActionTypes.UpdateIngredient;

  constructor(public ingredient: Ingredient) {}
}

export class DeleteIngredientAction implements Action {
  readonly type = ActionTypes.DeleteIngredient;

  constructor() {}
}

export class StartEditAction implements Action {
  readonly type = ActionTypes.StartEdit;

  constructor(public index: number) {}
}

export class StopEditAction implements Action {
  readonly type = ActionTypes.StopEdit;

  constructor() {}
}

export type ShoppingListActions =
  | AddIngredientAction
  | AddIngredientsAction
  | UpdateIngredientAction
  | DeleteIngredientAction
  | StartEditAction
  | StopEditAction;

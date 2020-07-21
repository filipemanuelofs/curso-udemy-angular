import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function reducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ActionTypes.AddIngredient:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredient],
      };
    case ShoppingListActions.ActionTypes.AddIngredients:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.ingredients],
      };
    case ShoppingListActions.ActionTypes.UpdateIngredient:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.ingredient,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case ShoppingListActions.ActionTypes.DeleteIngredient:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing, ingIndex) => {
          return ingIndex !== state.editedIngredientIndex;
        }),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case ShoppingListActions.ActionTypes.StartEdit:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.index] },
        editedIngredientIndex: action.index,
      };
    case ShoppingListActions.ActionTypes.StopEdit:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    default:
      return { ...state };
  }
}

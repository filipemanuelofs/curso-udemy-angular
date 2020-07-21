import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initalState: State = {
  recipes: [],
};

export function reducer(
  state = initalState,
  action: RecipeActions.RecipeActions
) {
  switch (action.type) {
    case RecipeActions.ActionTypes.SetRecipes:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipeActions.ActionTypes.AddRecipes:
      return { ...state, recipes: [...state.recipes, action.payload] };
    case RecipeActions.ActionTypes.UpdateRecipes:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe,
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return { ...state, recipes: updatedRecipes };
    case RecipeActions.ActionTypes.DeleteRecipes:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        }),
      };
    default:
      return { ...state };
  }
}

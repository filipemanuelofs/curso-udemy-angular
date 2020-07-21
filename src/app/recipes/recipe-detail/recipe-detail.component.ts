import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

import * as fromApp from '../../store/app.reducer';
import { DeleteRecipesAction } from '../store/recipe.actions';
import { AddIngredientsAction } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    // private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.State>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params.id;
        }),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipe');
        }),
        map((recipeState) => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });

    // this.route.params.subscribe((params: Params) => {
    //   this.id = params.id;
    //   this.store
    //     .select('recipe')
    //     .pipe(
    //       map((recipeState) => {
    //         return recipeState.recipes.find((recipe, index) => {
    //           return index === this.id;
    //         });
    //       })
    //     )
    //     .subscribe((recipe) => {
    //       this.recipe = recipe;
    //     });
    // });
  }

  onAddShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new AddIngredientsAction(this.recipe.ingredients));
    alert('Added!');
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new DeleteRecipesAction(this.id));
    this.router.navigate(['/recipes']);
  }
}

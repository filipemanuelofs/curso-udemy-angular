import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import {
  UpdateIngredientAction,
  AddIngredientAction,
  DeleteIngredientAction,
  StopEditAction,
} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  // startEditingSub: Subscription;
  storeSub: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.State>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = state.editedIngredient;
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(new UpdateIngredientAction(ingredient));
      this.editMode = false;
    } else {
      this.store.dispatch(new AddIngredientAction(ingredient));
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredientAction());
    this.onClear();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new StopEditAction());
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(new StopEditAction());
  }
}

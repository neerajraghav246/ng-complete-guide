import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';

import { Ingredient } from '../../shared/ingredient.model';
// import { ShoppingListService } from '../../services/shopping-list.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingForm') shoppingForm: NgForm;
  // subscription: Subscription;
  editMode = false;
  // editedItemIndex: number;
  editItem: Ingredient;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    // private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('shoppingList').pipe(takeUntil(this.unsubscribe)).subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editItem = stateData.editedIngredient;
        this.shoppingForm.setValue({
          'itemname': this.editItem.name,
          'amount': this.editItem.amount
        });
      } else {
        this.editMode = false;
      }
    });

    // this.subscription = this.shoppingService.startedEditing.subscribe((index: number) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   this.editItem = this.shoppingService.getIngredient(index);
    //   this.shoppingForm.setValue({
    //     'itemname': this.editItem.name,
    //     'amount': this.editItem.amount
    //   });
    // });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClear() {
    this.shoppingForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  onSubmit(shoppingForm: NgForm) {
    const shoppingItem = shoppingForm.value;
    const amount = (shoppingItem.amount) as number;
    const newIngredient = new Ingredient(shoppingItem.itemname, amount);
    if (this.editMode) {
      //this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient));
    }
    else {
      //this.shoppingService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    shoppingForm.reset();
  }
}

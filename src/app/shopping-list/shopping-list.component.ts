import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from '../services/shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // subscription: Subscription;
  constructor(
    // private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
    // this.ingredients = this.shoppingService.getIngredients();
    // this.subscription = this.shoppingService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredients = ingredients;
    // });
  }

  onEditItem(index: number) {
    // this.shoppingService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}

import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(
    // private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next([...this.recipes]);
  }

  getRecipes() {
    return [...this.recipes];
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredients(ingredients: Ingredient[]) {
    //this.shoppingService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next([...this.recipes]);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next([...this.recipes]);
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next([...this.recipes]);
  }

}

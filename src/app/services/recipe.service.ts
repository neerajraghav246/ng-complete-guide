import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  private recipes: Recipe[] = [
    new Recipe('A Tasty Schnitzel', 'A super tasty- just awesome', 'https://toriavey.com/images/2011/02/IMG_1544.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Big fat burger', 'What else you need to say...', 'https://s3-media0.fl.yelpcdn.com/bphoto/GiViTWiL8iHGhy-4NjDy_g/o.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ];
  constructor(private shoppingService: ShoppingListService) {

  }
  getRecipes() {
    return [...this.recipes];
  }
  addIngredients(ingredients: Ingredient[]) {
    this.shoppingService.addIngredients(ingredients);
  }
}

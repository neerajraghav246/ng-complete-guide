import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as recipeActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  // https://ng-course-recipe-book-3d50d.firebaseio.com/
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    // const recipes = this.recipeService.getRecipes();
    // this.http.put('https://ng-course-recipe-book-3d50d.firebaseio.com/recipes.json',
    //   recipes).subscribe(response => {
    //     console.log('storeRecipes response', response);
    //   });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-course-recipe-book-3d50d.firebaseio.com/recipes.json')
    .pipe(
      map(recipes => {
        return recipes.map((recipe) => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap((recipes) => {
        this.store.dispatch(new recipeActions.SetRecipes(recipes));
        // this.recipeService.setRecipes(recipes);
      }));
  }
}

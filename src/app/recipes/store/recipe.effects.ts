import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as recipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
    @Effect() fetchRecipes = this.action$
        .pipe(
            ofType(recipeActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                    'https://ng-course-recipe-book-3d50d.firebaseio.com/recipes.json'
                )
            }),
            map(recipes => {
                return recipes.map((recipe) => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            map((recipes => {
                return new recipeActions.SetRecipes(recipes);
            }))
        );

    @Effect({ dispatch: false }) storeRecipes = this.action$
        .pipe(
            ofType(recipeActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipeState]) => {
                return this.http.put('https://ng-course-recipe-book-3d50d.firebaseio.com/recipes.json',
                    recipeState.recipes);
            })
        );
    constructor(
        private action$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) { }
}
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as recipeActions from '../store/recipe.actions'
import { map, switchMap } from 'rxjs/operators';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((param: Params) => {
          this.id = +param['id'];
          return this.store.select('recipes')
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        })).subscribe(recipe => {
          this.recipe = recipe;
        });
  }


  onAddtoShoppingList() {
    this.store.dispatch(new shoppingListActions.AddIngredients(this.recipe.ingredients));
    // this.recipeService.addIngredients(this.recipe.ingredients);
  }

  onEditRecipe() {
    // this.router.navigate(['edit'], { relativeTo: this.route });
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new recipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

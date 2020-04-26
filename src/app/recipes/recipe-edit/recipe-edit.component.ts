import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import * as fromApp from '../../store/app.reducer';
import * as recipeActions from '../store/recipe.actions';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {

      this.editMode = param['id'] != null;
      if (this.editMode) {
        this.id = +param['id'];
      }
      this.initForm();
    });
  }

  initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.store.select('recipes')
        .pipe(
          take(1),
          map(recipeState => {
            return recipeState.recipes.find((item, index) => {
              return index === this.id;
            })
          })).subscribe(recipe => {
            recipeName = recipe.name;
            recipeDescription = recipe.description;
            recipeImagePath = recipe.imagePath;
            if (recipe['ingredients']) {
              for (let ingredient of recipe.ingredients) {
                recipeIngredients.push(
                  new FormGroup({
                    'name': new FormControl(ingredient.name, Validators.required),
                    'amount': new FormControl(ingredient.amount,
                      [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                  })
                );
              }
            }
            this.recipeForm = new FormGroup({
              'name': new FormControl(recipeName, Validators.required),
              'imagePath': new FormControl(recipeImagePath, Validators.required),
              'description': new FormControl(recipeDescription, Validators.required),
              'ingredients': recipeIngredients
            });
          });
    } else {
      this.recipeForm = new FormGroup({
        'name': new FormControl(recipeName, Validators.required),
        'imagePath': new FormControl(recipeImagePath, Validators.required),
        'description': new FormControl(recipeDescription, Validators.required),
        'ingredients': recipeIngredients
      });
    }

  }
  onAddIngredient() {
    const ingredients = (<FormArray>this.recipeForm.get('ingredients'));
    ingredients.push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    const recipeValue = this.recipeForm.value;
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, recipeValue);
      this.store.dispatch(new recipeActions.UpdateRecipe({ index: this.id, recipe: recipeValue }))
    }
    else {
      // this.recipeService.addRecipe(recipeValue);
      this.store.dispatch(new recipeActions.AddRecipe(recipeValue))
    }
    this.onCancel();
  }

  ondeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}

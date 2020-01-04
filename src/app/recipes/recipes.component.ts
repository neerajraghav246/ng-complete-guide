import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipeSelected: Recipe;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe((x: Recipe) => {
      this.recipeSelected = x;
    });
  }
  onRecipeEmitted(recipe: Recipe) {
    this.recipeSelected = recipe;
  }
}

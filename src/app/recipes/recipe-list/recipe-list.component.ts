import { Recipe } from './../recipe.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeEmitter = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test recipe', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg'),
    new Recipe('Second Recipe', 'This is a test recipe', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg')
  ];
  constructor() { }

  ngOnInit() {
  }
  onRecipeSelected(recipe) {
    this.recipeEmitter.emit(recipe);
  }
}

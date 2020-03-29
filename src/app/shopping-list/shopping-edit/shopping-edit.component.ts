import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../../services/shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingForm') shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editItem: Ingredient;
  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editItem = this.shoppingService.getIngredient(index);
      this.shoppingForm.setValue({
        'itemname': this.editItem.name,
        'amount': this.editItem.amount
      });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onClear() {
    this.shoppingForm.reset();
    this.editMode = false;
  }
  onDelete() {
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  onSubmit(shoppingForm: NgForm) {
    const shoppingItem = shoppingForm.value;
    const amount = (shoppingItem.amount) as number;
    const newIngredient = new Ingredient(shoppingItem.itemname, amount);
    if (this.editMode) {
      this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
    }
    else {
      this.shoppingService.addIngredient(newIngredient);
    }
    this.editMode = false;
    shoppingForm.reset();
  }
}

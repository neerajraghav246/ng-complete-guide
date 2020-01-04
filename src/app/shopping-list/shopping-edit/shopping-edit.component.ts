import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit() {
  }
  onAddItem() {
    const name = (this.nameInputRef.nativeElement as HTMLInputElement).value;
    const amount = ((this.amountInputRef.nativeElement as HTMLInputElement).value as any) as number;
    this.shoppingService.addIngredient(new Ingredient(name, amount));
  }
}

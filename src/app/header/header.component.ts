import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() NavigationEmitter = new EventEmitter<string>();
  onRecipeClick() {
    this.NavigationEmitter.emit('recipe');
  }
  onShoppingListClick() {
    this.NavigationEmitter.emit('shopping-list');
  }
}

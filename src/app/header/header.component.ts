import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import { AuthState } from '../auth/store/auth.reducer';
import * as authActions from '../auth/store/auth.actions';
import * as recipeActions from '../recipes/store/recipe.actions'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((user: AuthState) => {
      this.isAuthenticated = !!user.user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(new recipeActions.StoreRecipes());
    // this.dataStorageService.storeRecipes();
  }

  onFetchRecipes() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new recipeActions.FetchRecipes());
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new authActions.Logout());
  }
}

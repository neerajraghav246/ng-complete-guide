import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import * as fromApp from '../store/app.reducer';
import { AuthState } from '../auth/store/auth.reducer';
import * as authActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((user: AuthState) => {
      this.isAuthenticated = !!user.user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new authActions.Logout());
  }
}

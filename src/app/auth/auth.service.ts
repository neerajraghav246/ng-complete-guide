import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = null;
  tokenExpirationTimer: any;
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new authActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null; 
    }
  }
}

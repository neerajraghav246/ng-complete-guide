import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as fromApp from './store/app.reducer';
import * as authActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngapp-complete-guide';
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new authActions.AutoLogin());
  }
}

import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData } from './AuthResponseData';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  closeSub: Subscription;
  storeSub: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onAuthFormSubmit(authForm: NgForm) {
    if (authForm.invalid) {
      return;
    }
    const email = authForm.value.email;
    const password = authForm.value.password;
    // let authObservable: Observable<AuthResponseData>;
    // this.isLoading = true;
    if (this.isLoginMode) {
      // authObservable = this.authService.login(email, password);
      this.store.dispatch(
        new authActions.LoginStart({ email: email, password: password }))
    } else {
      this.store.dispatch(
        new authActions.SignupStart({ email: email, password: password }))
      //   authObservable = this.authService.signUp(email, password);
    }

    // authObservable.subscribe(responseData => {
    //   console.log('auth response data', responseData);
    //   this.isLoading = false;
    //   this.router.navigate(['/recipes']);
    // }, errorMessage => {
    //   this.error = errorMessage;
    //   this.showErrorAlert(errorMessage);
    //   this.isLoading = false;
    // });

    authForm.reset();
  }

  onHandleError() {
    // this.error = null;
    this.store.dispatch(new authActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.storeSub.unsubscribe();
  }
}

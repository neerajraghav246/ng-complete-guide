import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { AuthResponseData } from './AuthResponseData';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;
  tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcLj-g-_WhLd1iV0p4G3bxt0WnOnQTM-w',
        { email, password, returnSecureToken: true }).pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcLj-g-_WhLd1iV0p4G3bxt0WnOnQTM-w',
        { email, password, returnSecureToken: true }).pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObject = JSON.parse(userData);
      const loadedUser = new User(userDataObject.email, userDataObject.id, userDataObject._token, new Date(userDataObject._tokenExpirationDate));
      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userDataObject._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }
  }
  handleAuthentication(resData: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() +
      +resData.expiresIn * 1000);
    const user = new User(resData.email,
      resData.localId,
      resData.idToken,
      expirationDate);
    this.user.next(user);
    this.autoLogout(+resData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account';
        break;
      case 'INVALID_PASSWORD':
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Invalid login credentials';
        break;
    }
    return throwError(errorMessage);
  }
}

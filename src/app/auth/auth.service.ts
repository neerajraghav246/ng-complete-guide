import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { AuthResponseData } from './AuthResponseData';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();
  constructor(private http: HttpClient) { }

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

  handleAuthentication(resData: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() +
      +resData.expiresIn * 1000);
    const user = new User(resData.email,
      resData.localId,
      resData.idToken,
      expirationDate);
    this.user.next(user);
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

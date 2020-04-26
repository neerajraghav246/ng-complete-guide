import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as authActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../AuthResponseData';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

const handleAuthentication = (email: string, userId: string, token: string, expirationDate: Date) => {
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new authActions.AuthenticateSuccess(
        {
            email,
            userId,
            token,
            expirationDate,
            redirect: true
        }
    );
}

const handleError = (errorRes) => {
    let errorMessage = 'An unknown error occurred';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new authActions.AuthenticateFail(errorMessage));
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
    return of(
        new authActions.AuthenticateFail(errorMessage)
    );
}

@Injectable()
export class AuthEffects {

    @Effect() authSignup = this.actions$.pipe(
        ofType(authActions.SIGNUP_START),
        switchMap((signupAction: authActions.SignupStart) => {
            return this.http.post<AuthResponseData>
                ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
                    + environment.fireBaseApiKey,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    }).pipe(
                        tap((resData) => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            const expirationDate = new Date(new Date().getTime() +
                                +resData.expiresIn * 1000);
                            return handleAuthentication(resData.email, resData.localId, resData.idToken, expirationDate);
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes);
                        })
                    );
        }));

    @Effect() authLogin =
        this.actions$.pipe(
            ofType(authActions.LOGIN_START),
            switchMap((authData: authActions.LoginStart) => {
                return this.http.post<AuthResponseData>
                    ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseApiKey,
                        {
                            email: authData.payload.email,
                            password: authData.payload.password,
                            returnSecureToken: true
                        }).pipe(
                            tap((resData) => {
                                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                            }),
                            map(resData => {
                                const expirationDate = new Date(new Date().getTime() +
                                    +resData.expiresIn * 1000);
                                return handleAuthentication(resData.email, resData.localId, resData.idToken, expirationDate);
                            }),
                            catchError(errorRes => {
                                return handleError(errorRes);
                            })
                        );
            })
        );

    @Effect({ dispatch: false }) authRedirect = this.actions$
        .pipe(ofType(authActions.AUTHENTICATE_SUCCESS), tap((actionResponse:authActions.AuthenticateSuccess) => {
            if(actionResponse.payload.redirect){
                this.router.navigate(['/']);
            }
        }));

    @Effect({ dispatch: false }) authLogout = this.actions$
        .pipe(ofType(authActions.LOGOUT), tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        }));

    @Effect() autoLogin = this.actions$
        .pipe(ofType(authActions.AUTO_LOGIN), map(() => {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const userDataObject = JSON.parse(userData);
                const loadedUser = new User(userDataObject.email, userDataObject.id, userDataObject._token, new Date(userDataObject._tokenExpirationDate));
                if (loadedUser.token) {
                    const expirationDuration =
                        new Date(userDataObject._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(+expirationDuration);
                    return new authActions.AuthenticateSuccess(
                        {
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(userDataObject._tokenExpirationDate),
                            redirect: false
                        });
                }
                return { type: 'DUMMY' }
            }
            else {
                return { type: 'DUMMY' }
            }
        }));

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { }
}
import { User } from '../user.model';
import * as authActions from './auth.actions';

export interface AuthState {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: authActions.AvailableActions) {
    switch (action.type) {
        case authActions.AUTHENTICATE_SUCCESS:
            const userDetails = new User(action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate);
            return {
                ...state,
                user: userDetails,
                authError: null,
                loading: false
            };
        case authActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        case authActions.LOGIN_START:
        case authActions.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            }
        case authActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }
        case authActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }
        default: return state;
    }
}
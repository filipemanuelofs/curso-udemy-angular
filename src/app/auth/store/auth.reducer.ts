import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function reducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.ActionTypes.AuthenticateSuccess:
      const authUser = new User(
        action.payload.email,
        action.payload.localId,
        action.payload.token,
        action.payload.tokenExpirationDate
      );
      return {
        ...state,
        user: authUser,
        loading: false,
      };
    case AuthActions.ActionTypes.LoginStart:
    case AuthActions.ActionTypes.SignupStart:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.ActionTypes.AuthenticateFail:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case AuthActions.ActionTypes.Logout:
      return {
        ...state,
        user: null,
      };
    case AuthActions.ActionTypes.ClearError:
      return {
        ...state,
        authError: null,
      };
    default:
      return { ...state };
  }
}

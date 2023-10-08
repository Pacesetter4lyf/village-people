import { authReducer } from './auth.reducer';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../user.model';

describe('authReducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      user: null,
      authError: null,
      loading: false,
    };
    expect(authReducer(undefined, {} as AuthActions.AuthActions)).toEqual(
      initialState
    );
  });

  it('should handle AUTHENTICATE_SUCCESS', () => {
    const actionPayload = {
      email: 'test@example.com',
      userId: '123',
      token: 'token123',
      expirationDate: new Date(),
      isRegistered: '1234567',
    };
    const action = new AuthActions.Login(actionPayload);

    const expectedState = {
      user: new User(
        actionPayload.email,
        actionPayload.userId,
        actionPayload.token,
        actionPayload.expirationDate,
        actionPayload.isRegistered
      ),
      authError: null,
      loading: false,
    };

    expect(authReducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle LOGOUT', () => {
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 5).toString();
    const currentState = {
      user: new User(
        'test@example.com',
        '123456',
        'some token',
        new Date(expirationDate),
        '7891011'
      ),
      authError: null,
      loading: false,
    };
    const action = new AuthActions.Logout();

    const expectedState = {
      user: null,
      authError: null,
      loading: false,
    };

    expect(authReducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle LOGIN_START and SIGNUP_START', () => {
    const currentState = {
      user: null,
      authError: 'Previous error message',
      loading: false,
    };
    const loginStartAction = new AuthActions.LoginStart({
      email: 'test@example.com',
      password: '123456',
    });
    const signupStartAction = new AuthActions.SignupStart({
      email: 'test@example.com',
      password: '123456',
    });

    const expectedState = {
      user: null,
      authError: null,
      loading: true,
    };

    expect(authReducer(currentState, loginStartAction)).toEqual(expectedState);
    expect(authReducer(currentState, signupStartAction)).toEqual(expectedState);
  });

  it('should handle AUTHENTICATE_FAIL', () => {
    const currentState = {
      user: null,
      authError: null,
      loading: true,
    };
    const errorPayload = 'Authentication failed';
    const action = new AuthActions.AuthenticateFail(errorPayload);

    const expectedState = {
      user: null,
      authError: errorPayload,
      loading: false,
    };

    expect(authReducer(currentState, action)).toEqual(expectedState);
  });
});

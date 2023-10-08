import * as AuthActions from './auth.actions';

describe('Auth Actions', () => {
  it('should create an AutoLogin action', () => {
    const action = new AuthActions.AutoLogin();
    expect(action.type).toEqual(AuthActions.AUTO_LOGIN);
  });

  it('should create a SignupStart action', () => {
    const payload = { email: 'test@example.com', password: 'password123' };
    const action = new AuthActions.SignupStart(payload);
    expect(action.type).toEqual(AuthActions.SIGNUP_START);
    expect(action.payload).toEqual(payload);
  });

  it('should create a LoginStart action', () => {
    const payload = { email: 'test@example.com', password: 'password123' };
    const action = new AuthActions.LoginStart(payload);
    expect(action.type).toEqual(AuthActions.LOGIN_START);
    expect(action.payload).toEqual(payload);
  });

  it('should create an AuthenticateFail action', () => {
    const payload = 'Authentication failed';
    const action = new AuthActions.AuthenticateFail(payload);
    expect(action.type).toEqual(AuthActions.AUTHENTICATE_FAIL);
    expect(action.payload).toEqual(payload);
  });

  it('should create a Login action', () => {
    const payload = {
      email: 'test@example.com',
      userId: '123',
      token: 'token123',
      expirationDate: new Date(),
      isRegistered: 'true',
    };
    const action = new AuthActions.Login(payload);
    expect(action.type).toEqual(AuthActions.AUTHENTICATE_SUCCESS);
    expect(action.payload).toEqual(payload);
  });

  it('should create a Logout action', () => {
    const action = new AuthActions.Logout();
    expect(action.type).toEqual(AuthActions.LOGOUT);
  });

  it('should create an UpdateRegistration action', () => {
    const payload = 'true';
    const action = new AuthActions.UpdateRegistration(payload);
    expect(action.type).toEqual(AuthActions.UPDATE_REGISTRATION);
    expect(action.payload).toEqual(payload);
  });
});

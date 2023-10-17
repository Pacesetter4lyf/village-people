import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from '../actions/auth.actions';
import * as IndividualActions from 'src/app/main/personal/store/individual.actions';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { User } from '../../user.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
const apiUrl = environment.apiUrl;

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: AuthService;
  let router: Router;
  let store: Store<AppState>;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  // const httpSpy: jest.Mock<any>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: AuthService,
          useValue: {
            setLogoutTimer: jest.fn().mockReturnValue(null),
            clearLogoutTimer: jest.fn().mockReturnValue(null),
          },
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch Login on successful signup', () => {
    const signupAction = new AuthActions.SignupStart({
      email: 'test@example.com',
      password: 'password',
    });
    const authResponse = {
      status: 'success',
      token: 'mockToken',
      expiry: '2023-10-01T12:00:00.000Z',
      data: {
        user: {
          email: 'test@example.com',
          _id: '123',
          isRegistered: 'true',
        },
      },
    };

    const expectedAction = new AuthActions.Login({
      email: 'test@example.com',
      userId: '123',
      token: 'mockToken',
      expirationDate: new Date('2023-10-01T12:00:00.000Z'),
      isRegistered: 'true',
    });
    actions$ = of(signupAction);
    effects.authSignup.subscribe((result) => {
      expect(result).toEqual(expectedAction);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/users/signup`);
    expect(req.request.method).toBe('POST');
    req.flush(authResponse);
    httpTestingController.verify();

    expect(authService.setLogoutTimer).toHaveBeenCalled();
    expect(authService.clearLogoutTimer).not.toHaveBeenCalled();

    effects.authSignup.subscribe((action) => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      expect(action).toEqual(expectedAction);
    });
  });

  it('should dispatch AuthenticateFail on failed signup', () => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorMessage = 'Email already exists';

    const signupAction = new AuthActions.SignupStart({
      email: 'test@example.com',
      password: 'password',
    });
    const expectedAction = new AuthActions.AuthenticateFail(
      'Email already exists'
    );

    const httpSpy = jest.spyOn(httpClient, 'post').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: { message: errorMessage },
            status,
            statusText,
          })
      )
    );

    actions$ = of(signupAction);

    effects.authSignup.subscribe((result) => {
      expect(result).toEqual(expectedAction);
      expect(authService.setLogoutTimer).not.toHaveBeenCalled();
      expect(authService.clearLogoutTimer).not.toHaveBeenCalled();
      expect(httpSpy).toHaveBeenCalledWith(
        `${apiUrl}/users/signup`,
        expect.any(Object)
      );
    });
  });

  it('should dispatch Login on successful login', () => {
    const loginAction = new AuthActions.LoginStart({
      email: 'test@example.com',
      password: 'password',
    });
    const authResponse = {
      status: 'success',
      token: 'mockToken',
      expiry: '2023-10-01T12:00:00.000Z',
      data: {
        user: {
          email: 'test@example.com',
          _id: '123',
          isRegistered: 'true',
        },
      },
    };
    const httpSpy = jest
      .spyOn(httpClient, 'post')
      .mockReturnValue(of(authResponse));
    const expectedAction = new AuthActions.Login({
      email: 'test@example.com',
      userId: '123',
      token: 'mockToken',
      expirationDate: new Date('2023-10-01T12:00:00.000Z'),
      isRegistered: 'true',
    });
    actions$ = of(loginAction);

    effects.authLogin.subscribe((action) => {
      expect(action).toEqual(expectedAction);
      expect(httpSpy).toHaveBeenCalledWith(
        `${apiUrl}/users/login`,
        expect.any(Object)
      );
      expect(authService.setLogoutTimer).toHaveBeenCalled();
      expect(authService.clearLogoutTimer).not.toHaveBeenCalled();
    });
  });
  it('should dispatch AuthenticateFail on failed login', () => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorMessage = 'incorrect email or password';

    const LoginAction = new AuthActions.LoginStart({
      email: 'test@example.com',
      password: 'password',
    });
    const expectedAction = new AuthActions.AuthenticateFail(errorMessage);

    const httpSpy = jest.spyOn(httpClient, 'post').mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: { message: errorMessage },
            status,
            statusText,
          })
      )
    );

    actions$ = of(LoginAction);
    effects.authSignup.subscribe((action) => {
      expect(action).toEqual(expectedAction);
      expect(authService.setLogoutTimer).not.toHaveBeenCalled();
      expect(authService.clearLogoutTimer).not.toHaveBeenCalled();
      expect(httpSpy).toHaveBeenCalledWith(
        `${apiUrl}/users/login`,
        expect.any(Object)
      );
    });
  });
  it('calls the "individual" route when auth successful', () => {
    const loginAction = new AuthActions.Login({
      email: 'test@example.com',
      userId: '123',
      token: 'mockToken',
      expirationDate: new Date('2023-10-01T12:00:00.000Z'),
      isRegistered: 'true',
    });
    const routerSpy = jest
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(null);
    actions$ = of(loginAction);

    effects.authSuccess.subscribe();
    expect(routerSpy).toHaveBeenCalledWith(['/individual']);
  });
  it('navigates to auth, clear timer, clear local storage and clear user upon logout', () => {
    const logoutAction = new AuthActions.Logout();
    const routerSpy = jest
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(null);
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    // Storage.prototype.removeItem = jest.fn();

    actions$ = of(logoutAction);

    effects.authLogout.subscribe();
    expect(routerSpy).toHaveBeenCalledWith(['/auth']);
    expect(store.dispatch).toHaveBeenCalledWith(IndividualActions.removeUser());
    expect(authService.clearLogoutTimer).toHaveBeenCalled();
    expect(removeItemSpy).toHaveBeenCalledWith('user');
    // expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });
  it('rerurns a dummy action if no user in the local storage', async () => {
    const autoLoginAction = new AuthActions.AutoLogin();

    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(null));

    actions$ = of(autoLoginAction);

    const action = await firstValueFrom(effects.autoLogin);
    expect(action).toEqual({ type: 'DUMMY' });
    expect(authService.setLogoutTimer).not.toHaveBeenCalled();

    // effects.autoLogin.subscribe((action) => {
    //   expect(action).toEqual({ type: 'DUMMY' });
    //   expect(authService.setLogoutTimer).not.toHaveBeenCalled();
    // });
  });
  it('rerurns a dummy action if no user has no token', async () => {
    const autoLoginAction = new AuthActions.AutoLogin();

    const localUser = {
      email: 'test@example.com',
      id: '123456',
      _token: '',
      _tokenExpirationDate: '2023-10-01T12:00:00.000Z',
      _isRegistered: '7891011',
    };
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(localUser));

    actions$ = of(autoLoginAction);
    const action = await firstValueFrom(effects.autoLogin);
    expect(action).toEqual({ type: 'DUMMY' });
    expect(authService.setLogoutTimer).not.toHaveBeenCalled();

    // effects.autoLogin.subscribe((action) => {
    //   expect(action).toEqual({ type: 'DUMMY' });
    //   expect(authService.setLogoutTimer).not.toHaveBeenCalled();
    // });
  });
  it('returns a DUMMY action if token is expired', async () => {
    const autoLoginAction = new AuthActions.AutoLogin();
    const expectedAction = { type: 'DUMMY' };

    const localUser = {
      email: 'test@example.com',
      id: '123456',
      _token: 'some token',
      _tokenExpirationDate: '2023-10-01T12:00:00.000Z',
      _isRegistered: '7891011',
    };
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(localUser));

    actions$ = of(autoLoginAction);

    const action = await firstValueFrom(effects.autoLogin);
    expect(action).toEqual(expectedAction);
    expect(authService.setLogoutTimer).not.toHaveBeenCalled();

    // effects.autoLogin.subscribe((action) => {
    //   console.log('action ', action);
    //   expect(action).toEqual(expectedAction);
    //   expect(authService.setLogoutTimer).not.toHaveBeenCalled();
    // });
  });
  it('returns a login action if user is available', async () => {
    const autoLoginAction = new AuthActions.AutoLogin();
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 5).toString();
    const expectedAction = new AuthActions.Login({
      email: 'test@example.com',
      userId: '123456',
      token: 'some token',
      expirationDate: new Date(expirationDate),
      isRegistered: '7891011',
    });

    const localUser = {
      email: 'test@example.com',
      id: '123456',
      _token: 'some token',
      _tokenExpirationDate: expirationDate,
      _isRegistered: '7891011',
    };
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(localUser));

    actions$ = of(autoLoginAction);

    const action = await firstValueFrom(effects.autoLogin);
    expect(action).toEqual(expectedAction);
    expect(authService.setLogoutTimer).toHaveBeenCalled();
  });
  it('fires a login action when the user registers', async () => {
    const updateRegistrationAction = new AuthActions.UpdateRegistration(
      '7891011'
    );
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 5).toString();
    const expectedAction = new AuthActions.Login({
      email: 'test@example.com',
      userId: '123456',
      token: 'some token',
      expirationDate: new Date(expirationDate),
      isRegistered: '7891011',
    });
    const localUser = {
      email: 'test@example.com',
      id: '123456',
      _token: 'some token',
      _tokenExpirationDate: expirationDate,
      _isRegistered: '',
    };
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify(localUser));

    actions$ = of(updateRegistrationAction);
    const action = await firstValueFrom(effects.updateLocalStorageAndLogin);
    expect(action).toEqual(expectedAction);
  });
});

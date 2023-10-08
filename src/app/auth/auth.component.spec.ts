import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AuthComponent } from './auth.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { cold } from 'jasmine-marbles';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  Actions,
  createEffect,
  ofType,
  EffectsModule,
  EffectsRootModule,
} from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { of } from 'rxjs';
import {
  AuthenticateFail,
  Login,
  LoginStart,
  Logout,
  SignupStart,
} from './store/actions/auth.actions';
import { Router } from '@angular/router';
import { AuthEffects } from './store/effects/auth.effects';
import { By } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { authReducer } from './store/reducer/auth.reducer';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import {
  click,
  findEl,
  setFieldValue,
} from '../spec-helper/element.spec-helper';

const apiUrl = environment.apiUrl;

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let store: MockStore;
  let fakeAuthService: Partial<AuthService>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let authEffects: AuthEffects;
  const initialState = {
    auth: {
      user: null,
    },
  };

  beforeEach(waitForAsync(() => {
    fakeAuthService = {
      clearLogoutTimer: jest.fn(),
      setLogoutTimer: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [AuthComponent, LoadingSpinnerComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        AuthEffects,
        { provide: AuthService, useValue: fakeAuthService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should dispatch the sign in action', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    component.isLoginMode = true;
    const emailInput = fixture.debugElement.query(
      By.css('input[name="email"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );

    emailInput.nativeElement.value = 'test@example.com';
    passwordInput.nativeElement.value = 'password123';

    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });
    passwordInput.triggerEventHandler('input', {
      target: passwordInput.nativeElement,
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton.nativeElement.disabled).toBeFalsy();
    submitButton.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoginStart({ email, password })
    );
  });
  it('should dispatch the sign up action', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const emailInput = fixture.debugElement.query(
      By.css('input[name="email"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );

    click(fixture, 'switch-mode');
    expect(component.isLoginMode).toBe(false);

    emailInput.nativeElement.value = email;
    passwordInput.nativeElement.value = password;

    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });
    passwordInput.triggerEventHandler('input', {
      target: passwordInput.nativeElement,
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton.nativeElement.disabled).toBeFalsy();
    submitButton.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      new SignupStart({ email, password })
    );
  });

  it('does not accept improper inputs', () => {
    setFieldValue(fixture, 'email', 'emmanuelgma');
    setFieldValue(fixture, 'password', '12346');
    findEl(fixture, 'submit-button').nativeElement.click();
    fixture.detectChanges();
    expect(store.dispatch).not.toHaveBeenCalled();

    setFieldValue(fixture, 'email', 'emmanuel@gmail.com');
    setFieldValue(fixture, 'password', '12345');
    fixture.detectChanges();
    findEl(fixture, 'submit-button').nativeElement.click();
    expect(store.dispatch).not.toHaveBeenCalled();

    setFieldValue(fixture, 'email', 'emmanuelgmail.com');
    setFieldValue(fixture, 'password', '123456');
    fixture.detectChanges();
    findEl(fixture, 'submit-button').nativeElement.click();
    expect(store.dispatch).not.toHaveBeenCalled();

    setFieldValue(fixture, 'email', 'emmanuel@gmail.com');
    setFieldValue(fixture, 'password', '1234567');
    fixture.detectChanges();
    findEl(fixture, 'submit-button').nativeElement.click();
    expect(store.dispatch).toHaveBeenCalled();
  });
  it('should display error messages', () => {
    const newState = {
      auth: {
        user: null,
        authError: 'username or password incorrect',
        isLoading: false,
      },
    };
    store.setState(newState);
    fixture.detectChanges();
    const errorElement = findEl(fixture, 'error');
    const errorMessage = errorElement.nativeElement.textContent;
    expect(errorMessage).toContain('username or password incorrect');
  });
});

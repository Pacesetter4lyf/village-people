import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AuthComponent } from './auth.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { cold, hot } from 'jasmine-marbles';
import { ReplaySubject } from 'rxjs';
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
import { of, switchMap, map, tap } from 'rxjs';
import {
  Login,
  LOGIN_START,
  LoginStart,
  Logout,
} from './store/actions/auth.actions';
import { Router } from '@angular/router';
import { AuthEffects } from './store/effects/auth.effects';
import { inject } from '@angular/core';
import { By } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { authReducer } from './store/reducer/auth.reducer';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { PersonalComponent } from '../main/personal/personal.component';
const apiUrl = environment.apiUrl;

// class MockEffects {
//   signInEffect$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(LOGIN_START),
//       switchMap(() =>
//         of(
//           new Login({
//             email: 'emmanuel@gmail.com',
//             userId: '1234',
//             token: 'token',
//             expirationDate: new Date(Date.now() + 5000),
//             isRegistered: '5678',
//           })
//         )
//       )
//     )
//   );
//   authSuccess = createEffect(
//     () =>
//       this.actions$.pipe(
//         ofType(AUTHENTICATE_SUCCESS),
//         tap(() => {
//           this.router.navigate(['/individual']);
//         })
//       ),
//     { dispatch: false }
//   );

//   constructor(private actions$: Actions, private router: Router) {}
// }

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let store: MockStore;
  let fakeAuthService: Partial<AuthService>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let authEffects: AuthEffects;
  let actions$: Actions;
  let actionsSubject: Subject<any>;
  let effectsModule: EffectsRootModule;
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
      imports: [
        FormsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({ auth: authReducer }),
        EffectsModule.forRoot([AuthEffects]),
        RouterTestingModule.withRoutes([
          { path: 'auth', component: AuthComponent },
          { path: 'individual', component: PersonalComponent },
        ]),
      ],
      providers: [
        AuthEffects,
        { provide: AuthService, useValue: fakeAuthService },
        // provideMockStore({ initialState }), // Provide a mock store with your initial state
      ],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    jest.spyOn(store, 'dispatch');
    httpTestingController = TestBed.inject(HttpTestingController);
    authEffects = TestBed.inject(AuthEffects);

    router = TestBed.inject(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have access to the AuthEffects instance', () => {
    expect(authEffects).toBeDefined();
    // You can now interact with the authEffects instance and test its behavior
  });
  it('should sign in and call the "/individual" route', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.isLoginMode = true;
    const emailInput = fixture.debugElement.query(
      By.css('input[name="email"]')
    );
    const passwordInput = fixture.debugElement.query(
      By.css('input[name="password"]')
    );

    // Set predefined values for email and password
    emailInput.nativeElement.value = 'test@example.com';
    passwordInput.nativeElement.value = 'password123';

    // Trigger input events to update ngModel
    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });
    passwordInput.triggerEventHandler('input', {
      target: passwordInput.nativeElement,
    });
    fixture.detectChanges();
    const mockResponse = {
      data: {
        user: {
          email: 'emmanuel@gmail.com',
          userId: '1234',
          token: 'token',
          expirationDate: new Date(Date.now() + 5000),
          isRegistered: '5678',
        },
      },
      status: 'success',
    };

    // Query for the submit button
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );

    // Assert that the submit button is enabled
    expect(submitButton.nativeElement.disabled).toBeFalsy();

    // Click the submit button
    submitButton.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      new LoginStart({ email, password })
    );
    const req = httpTestingController.expectOne(`${apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    // store.dispatch(new Logout());
    fixture.detectChanges();
    // await fixture.whenStable();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        new Login({
          email: 'emmanuel@gmail.com',
          userId: '1234',
          token: 'token',
          expirationDate: new Date(Date.now() + 5000),
          isRegistered: '5678',
        })
      );
    }, 1000);

    httpTestingController.verify();

    expect(navigateSpy).toHaveBeenCalledWith(['/individual']);
  });
});

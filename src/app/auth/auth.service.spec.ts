import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AuthService } from './auth.service';
import * as AuthActions from './store/actions/auth.actions';

describe('AuthService', () => {
  let authService: AuthService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})], // Mock the NgRx store
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should dispatch a Logout action when setLogoutTimer is called', fakeAsync(() => {
    const expirationDuration = 1000; // milliseconds
    const spyDispatch = jest.spyOn(store, 'dispatch');

    authService.setLogoutTimer(expirationDuration);

    // Advance time by 1000 ms
    tick(expirationDuration);

    expect(spyDispatch).toHaveBeenCalledWith(new AuthActions.Logout());
  }));

  it('should clear the timer when clearLogoutTimer is called', () => {
    const expirationDuration = 1000; // milliseconds
    const spyClearTimeout = jest.spyOn(window, 'clearTimeout');

    authService.setLogoutTimer(expirationDuration);
    const tokenExpirationTimer = authService['tokenExpirationTimer'];
    // To test clearLogoutTimer, you can call it directly
    authService.clearLogoutTimer(); // Accessing private method for testing

    expect(spyClearTimeout).toHaveBeenCalledWith(tokenExpirationTimer);
  });
});

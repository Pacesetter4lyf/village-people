import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { canActivateFn, canActivateFnLineage } from './auth-guard.service'; // Import the guard function
import { Observable, of, throwError, firstValueFrom } from 'rxjs';

describe('AuthGuard', () => {
  let guard: any; // Define a variable to hold the guard instance
  let router: any; // Mocked Router
  let store: any; // Mocked Store

  const setup = (
    select: jest.Mock,
    type: 'individual' | 'lineage' = 'individual'
  ) => {
    router = {
      navigate: jest.fn(),
    };

    store = {
      select: select,
    };
    TestBed.configureTestingModule({
      providers: [
        canActivateFn,
        canActivateFnLineage,
        { provide: Router, useValue: router },
        { provide: Store, useValue: store },
      ],
    });
    if (type === 'individual')
      return TestBed.runInInjectionContext(canActivateFn);
    return TestBed.runInInjectionContext(canActivateFnLineage);
  };

  it('should return true for an authenticated user', async () => {
    const select = jest.fn().mockReturnValue(of({ user: 'user' }));
    const guard = setup(select) as Observable<true | Promise<boolean>>;
    const result = await firstValueFrom(guard);
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to "auth" route for an unauthenticated user', async () => {
    const select = jest.fn().mockReturnValue(of({ user: null }));
    const guard = setup(select) as Observable<true | Promise<boolean>>;
    await firstValueFrom(guard);
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });

  it('should return "true" if individual exists', async () => {
    const select = jest.fn().mockReturnValue(of({ actualUser: 'user' }));
    const guard = setup(select, 'lineage') as Observable<boolean>;
    const result = await firstValueFrom(guard);
    expect(result).toBe(true);
  });

  it('should return "false" if individual doesnt exist', async () => {
    const select = jest.fn().mockReturnValue(of({ actualUser: null }));
    const guard = setup(select, 'lineage') as Observable<boolean>;
    const result = await firstValueFrom(guard);
    expect(result).toBe(false);
  });
});

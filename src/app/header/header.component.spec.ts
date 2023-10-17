// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HeaderComponent } from './header.component';
// import { provideMockStore } from '@ngrx/store/testing';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;

//   beforeEach(async () => {
//     TestBed.configureTestingModule({
//       declarations: [HeaderComponent],
//       providers: [provideMockStore({})],
//       imports: [RouterTestingModule],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it.todo('displays contact us and about us when user not signed in');
//   it.todo('displays individual when user is signed in');
//   it.todo('calls the auth route when sign in is clicked');
//   it.todo('does not display lineage if actual user is not loaded');
//   it.todo('displays signout when user is signed in');
//   it.todo('displays sign in when user is signed out');
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore;
  const initialState = { individual: { actualUser: null } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, StoreModule.forRoot({})],
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays contact us and about us when user not signed in', () => {
    fixture.detectChanges();

    const contactUsLink = fixture.nativeElement.querySelector(
      'a[routerLink="/contactus"]'
    );
    const aboutUsLink = fixture.nativeElement.querySelector(
      'a[routerLink="/about"]'
    );

    expect(contactUsLink).toBeTruthy();
    expect(aboutUsLink).toBeTruthy();
  });

  it('displays individual when user is signed in', () => {
    store.setState({
      individual: {
        actualUser: {
          _id: 'some id',
        },
      },
    });
    fixture.detectChanges();

    const individualLink = fixture.nativeElement.querySelector(
      'a[routerLink="/individual"]'
    );

    expect(individualLink).toBeTruthy();
  });

  it('calls the auth route when sign in is clicked', () => {
    const routerNavigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();

    const signInButton = fixture.nativeElement.querySelector('.btn');
    signInButton.click();
    fixture.detectChanges();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['auth']);
  });

  it('does not display lineage if actual user is not loaded', () => {
    fixture.detectChanges();

    const lineageLink = fixture.nativeElement.querySelector(
      'a[routerLink="/lineage"]'
    );
    const individualLink = fixture.nativeElement.querySelector(
      'a[routerLink="/individual"]'
    );

    expect(lineageLink).toBeFalsy();
    expect(individualLink).toBeFalsy();
  });

  it('displays signout when user is signed in', () => {
    store.setState({
      individual: {
        actualUser: {
          _id: 'some id',
        },
      },
    });
    fixture.detectChanges();

    const signOutButton = fixture.nativeElement.querySelector('.btn');
    expect(signOutButton.textContent).toContain('SIGN OUT');
  });

  it('displays sign in when user is signed out', () => {
    fixture.detectChanges();

    // const { debugElement } = fixture;
    // const button = debugElement.query(By.css('.btn'));
    // expect(button.nativeElement.textContent).toContain('SIGN IN');

    const signInButton = fixture.nativeElement.querySelector('.btn');
    expect(signInButton.textContent).toContain('SIGN IN');
  });
});

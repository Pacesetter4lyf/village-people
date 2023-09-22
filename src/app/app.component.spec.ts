// import 'zone.js';
// import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatSmallComponent } from './main/chat/chat.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { AppModule } from './app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
      });
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'village-people'`, () => {
    expect(app.title).toEqual('ClanHub');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain(
  //     'village-people app is running!'
  //   );
  // });
});

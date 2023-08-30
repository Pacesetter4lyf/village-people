import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent, SafePipe } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { IndividualService } from './main/personal/individual.service';
import { AuthInterceptorService } from './auth/auth-inteceptor.service';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { ChatSmallComponent } from './main/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { actualUserReducer } from './store/actual-user.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    SafePipe,

    ChatSmallComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UcWidgetModule,
    FontAwesomeModule,
    SharedModule, // basically for resources
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot({
      actualUser:  actualUserReducer
    }, {}),
  ],
  providers: [
    IndividualService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  // schemas:[],
  bootstrap: [AppComponent],
})
export class AppModule {}

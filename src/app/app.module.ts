import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent, SafePipe } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { IndividualService } from './main/personal/individual.service';
import { AuthInterceptorService } from './auth/auth-inteceptor.service';

// import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { ChatSmallComponent } from './main/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { chatEffects } from './main/chat/store/chat.effects';
import { appEffects } from './store/app.effects';

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
    // UcWidgetModule,
    FontAwesomeModule,
    SharedModule, // basically for resources
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.AppReducer, {}),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
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

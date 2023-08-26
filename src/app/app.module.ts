import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent, SafePipe } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecordingsComponent } from './shared/recordings/recordings.component';
import { PicturesComponent } from './shared/pictures/pictures.component';
import { VideosComponent } from './shared/videos/videos.component';
import { LineageComponent } from './main/lineage/lineage.component';
import { TreeComponent } from './main/lineage/tree/tree.component';
import { SearchComponent } from './main/lineage/search/search.component';
// remove the below
import { DiscussionComponent } from './main/lineage/discussion/discussion.component';
import { SingleComponent } from './main/lineage/discussion/single/single.component';

import { BirthdaysComponent } from './main/lineage/birthdays/birthdays.component';
import { FundsComponent } from './main/lineage/funds/funds.component';
import { GalleryComponent } from './main/lineage/gallery/gallery.component';
import { LandingComponent } from './landing/landing.component';
// import { MainComponent } from './main/main.component';
import { TextInputComponent } from './helper.component/text-input/text-input.component';
import { LineageHeaderComponent } from './main/lineage/lineage-header/lineage-header.component';
import { PostsComponent } from './shared/posts/posts.component';

// import { ChatsComponent } from './main/personal/chats/chats.component';
// import { ChatComponent } from './main/personal/chats/chat/chat.component';
import { IndividualService } from './main/personal/individual.service';
import { AuthComponent } from './auth/auth.component';
import { AppendComponent } from './main/lineage/append/append.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-inteceptor.service';
import { ModalComponent } from './shared/modal/modal.component';
import { ButtonComponent } from './shared/modal/button/button.component';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { LinkComponent } from './main/lineage/link/link.component';
import { AdminComponent } from './main/lineage/admin/admin.component';
import { MediaComponent } from './main/personal/media/media.component';
import { ForumComponent } from './main/lineage/forum/forum.component';
import { MatterComponent } from './main/lineage/forum/matter/matter.component';
import { DiscussionEditComponent } from './main/lineage/forum/discussion-edit/discussion-edit.component';
import { ChatSmallComponent } from './main/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { PersonalModule } from './main/personal/personal.module';
import { LineageModule } from './main/lineage/lineage.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,

    RecordingsComponent,
    PicturesComponent,
    VideosComponent,
    PostsComponent,
    LoadingSpinnerComponent,
    ButtonComponent,


    // DiscussionComponent,
    // SingleComponent,
    // FundsComponent,
    // ChatComponent,
    // ChatsComponent,
    // TextInputComponent
    // MainComponent,

    AuthComponent,
    ChatSmallComponent,
    SafePipe,



  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UcWidgetModule,
    FontAwesomeModule,
    PersonalModule, 
    LineageModule,
    AppRoutingModule,
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent, SafePipe } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PersonalComponent } from './main/personal/personal.component';
import { BasicComponent } from './main/personal/basic/basic.component';
import { EducationComponent } from './main/personal/education/education.component';
import { BibliographyComponent } from './main/personal/bibliography/bibliography.component';
import { RecordingsComponent } from './shared/recordings/recordings.component';
import { PicturesComponent } from './shared/pictures/pictures.component';
import { VideosComponent } from './shared/videos/videos.component';
import { LineageComponent } from './main/lineage/lineage.component';
import { TreeComponent } from './main/lineage/tree/tree.component';
import { SearchComponent } from './main/lineage/search/search.component';
import { DiscussionComponent } from './main/lineage/discussion/discussion.component';
import { BirthdaysComponent } from './main/lineage/birthdays/birthdays.component';
import { FundsComponent } from './main/lineage/funds/funds.component';
import { GalleryComponent } from './main/lineage/gallery/gallery.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { TextInputComponent } from './helper.component/text-input/text-input.component';
import { PersonalHeaderComponent } from './main/personal/personal-header/personal-header.component';
import { LineageHeaderComponent } from './main/lineage/lineage-header/lineage-header.component';
import { SettingsComponent } from './main/personal/settings/settings.component';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './shared/posts/posts.component';
import { SingleComponent } from './main/lineage/discussion/single/single.component';
import { ChatsComponent } from './main/personal/chats/chats.component';
import { IndividualService } from './main/personal/individual.service';
import { AuthComponent } from './auth/auth.component';
import { canActivateFn } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { AppendComponent } from './main/lineage/append/append.component';
import { RelationshipComponent } from './main/personal/settings/relationship/relationship.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-inteceptor.service';
import { IndividualResolver } from './main/personal/individual-resolver.service';
import { ModalComponent } from './shared/modal/modal.component';
import { ButtonComponent } from './shared/modal/button/button.component';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { ResourceResolver } from './main/lineage/lineage-resource-resolver';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'lineage',
    component: LineageComponent,
    canActivate: [canActivateFn],
    resolve: [IndividualResolver, ResourceResolver],
    children: [
      { path: '', redirectTo: 'tree', pathMatch: 'full' },
      { path: 'tree', component: TreeComponent },
      { path: 'discussions', component: DiscussionComponent },
      { path: 'discussions/:single', component: SingleComponent },
      { path: 'birthdays', component: BirthdaysComponent },
      { path: 'funds', component: FundsComponent },
      {
        path: 'media',
        component: GalleryComponent,
        data: { isEditable: false },
        children: [
          {
            path: 'posts',
            component: PostsComponent,
            data: { isEditable: false },
          },
          {
            path: 'audios',
            component: RecordingsComponent,
            data: { isEditable: false },
          },
          {
            path: 'photos',
            component: PicturesComponent,
            data: { isEditable: false },
          },
          {
            path: 'videos',
            component: VideosComponent,
            data: { isEditable: false },
          },
          {
            path: '',
            redirectTo: 'posts',
            pathMatch: 'full',
          },
        ],
      },
      { path: 'search', component: SearchComponent },
    ],
  },

  {
    path: 'individual',
    component: PersonalComponent,
    canActivate: [canActivateFn],
    resolve: [IndividualResolver],
    children: [
      { path: 'basic', component: BasicComponent },
      { path: 'education', component: EducationComponent },
      { path: 'bibliography', component: BibliographyComponent },
      { path: 'recordings', component: RecordingsComponent },
      { path: 'pictures', component: PicturesComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'chats', component: ChatsComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: 'info', component: ChatsComponent },
          { path: 'media', component: ChatsComponent },
          { path: 'relationship', component: ChatsComponent },
          { path: 'merge', component: ChatsComponent },
        ],
      },
      { path: '', redirectTo: 'basic', pathMatch: 'full' },
    ],
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: LandingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PersonalComponent,
    BasicComponent,
    EducationComponent,
    BibliographyComponent,
    RecordingsComponent,
    PicturesComponent,
    VideosComponent,
    LineageComponent,
    TreeComponent,
    SearchComponent,
    DiscussionComponent,
    BirthdaysComponent,
    FundsComponent,
    GalleryComponent,
    LandingComponent,
    MainComponent,
    TextInputComponent,
    PersonalHeaderComponent,
    LineageHeaderComponent,
    SettingsComponent,
    PostsComponent,
    SingleComponent,
    ChatsComponent,
    AuthComponent,
    AppendComponent,
    RelationshipComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    ButtonComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    UcWidgetModule,
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

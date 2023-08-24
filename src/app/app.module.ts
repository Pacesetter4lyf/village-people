import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Routes, RouterModule, RouterStateSnapshot } from '@angular/router';
import { PostsComponent } from './shared/posts/posts.component';
import { SingleComponent } from './main/lineage/discussion/single/single.component';
import { ChatsComponent } from './main/personal/chats/chats.component';
import { ChatComponent } from './main/personal/chats/chat/chat.component';
import { IndividualService } from './main/personal/individual.service';
import { AuthComponent } from './auth/auth.component';
import { canActivateFn } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { AppendComponent } from './main/lineage/append/append.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-inteceptor.service';
import { IndividualResolver } from './main/personal/individual-resolver.service';
import { ModalComponent } from './shared/modal/modal.component';
import { ButtonComponent } from './shared/modal/button/button.component';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { ResourceResolver } from './main/lineage/lineage-resource-resolver';
import {
  chatGuard,
  IndividualGuard,
  settingsGuard,
} from './main/personal/individual-guard.service';
import { LinkComponent } from './main/lineage/link/link.component';
import { AdminComponent } from './main/lineage/admin/admin.component';
import { MediaComponent } from './main/personal/media/media.component';
import { ForumComponent } from './main/lineage/forum/forum.component';
import { MatterComponent } from './main/lineage/forum/matter/matter.component';
import { DiscussionEditComponent } from './main/lineage/forum/discussion-edit/discussion-edit.component';
import { ChatSmallComponent } from './main/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [canActivateFn],
    children: [
      {
        path: 'lineage',
        component: LineageComponent,
        canActivate: [canActivateFn],
        resolve: [IndividualResolver],
        children: [
          { path: '', redirectTo: 'tree', pathMatch: 'full' },
          { path: 'tree', component: TreeComponent },
          { path: 'link', component: LinkComponent },
          // { path: 'discussions', component: DiscussionComponent },
          // { path: 'discussions/:single', component: SingleComponent },
          // { path: 'funds', component: FundsComponent },
          { path: 'forum', component: ForumComponent },
          { path: 'forum/new', component: DiscussionEditComponent },
          { path: 'forum/:id', component: MatterComponent },
          { path: 'forum/:id/edit', component: DiscussionEditComponent },
          { path: 'birthdays', component: BirthdaysComponent },
          { path: 'admin', component: AdminComponent },
          {
            path: 'media',
            component: GalleryComponent,
            children: [
              {
                path: 'posts',
                component: PostsComponent,
              },
              {
                path: 'audios',
                component: RecordingsComponent,
              },
              {
                path: 'photos',
                component: PicturesComponent,
              },
              {
                path: 'videos',
                component: VideosComponent,
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
          {
            path: 'media',
            component: MediaComponent,
            children: [
              {
                path: 'posts',
                component: PostsComponent,
              },
              {
                path: 'audios',
                component: RecordingsComponent,
              },
              {
                path: 'photos',
                component: PicturesComponent,
              },
              {
                path: 'videos',
                component: VideosComponent,
              },
              {
                path: '',
                redirectTo: 'posts',
                pathMatch: 'full',
              },
            ],
          },
          // {
          //   path: 'chats',
          //   component: ChatsComponent,
          //   resolve: [chatGuard],
          //   children: [{ path: ':id', component: ChatComponent }],
          // },
          {
            path: 'settings',
            component: SettingsComponent,
            resolve: [settingsGuard],
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
      { path: '', redirectTo: 'individual', pathMatch: 'full' },
    ],
  },
  // {
  //   path: 'lineage',
  //   component: LineageComponent,
  //   canActivate: [canActivateFn],
  //   resolve: [IndividualResolver],
  //   children: [
  //     { path: '', redirectTo: 'tree', pathMatch: 'full' },
  //     { path: 'tree', component: TreeComponent },
  //     { path: 'link', component: LinkComponent },
  //     // { path: 'discussions', component: DiscussionComponent },
  //     // { path: 'discussions/:single', component: SingleComponent },
  //     // { path: 'funds', component: FundsComponent },
  //     { path: 'forum', component: ForumComponent },
  //     { path: 'forum/new', component: DiscussionEditComponent },
  //     { path: 'forum/:id', component: MatterComponent },
  //     { path: 'forum/:id/edit', component: DiscussionEditComponent },
  //     { path: 'birthdays', component: BirthdaysComponent },
  //     { path: 'admin', component: AdminComponent },
  //     {
  //       path: 'media',
  //       component: GalleryComponent,
  //       children: [
  //         {
  //           path: 'posts',
  //           component: PostsComponent,
  //         },
  //         {
  //           path: 'audios',
  //           component: RecordingsComponent,
  //         },
  //         {
  //           path: 'photos',
  //           component: PicturesComponent,
  //         },
  //         {
  //           path: 'videos',
  //           component: VideosComponent,
  //         },
  //         {
  //           path: '',
  //           redirectTo: 'posts',
  //           pathMatch: 'full',
  //         },
  //       ],
  //     },
  //     { path: 'search', component: SearchComponent },
  //   ],
  // },

  // {
  //   path: 'individual',
  //   component: PersonalComponent,
  //   canActivate: [canActivateFn],
  //   resolve: [IndividualResolver],
  //   children: [
  //     { path: 'basic', component: BasicComponent },
  //     { path: 'education', component: EducationComponent },
  //     { path: 'bibliography', component: BibliographyComponent },
  //     {
  //       path: 'media',
  //       component: MediaComponent,
  //       children: [
  //         {
  //           path: 'posts',
  //           component: PostsComponent,
  //         },
  //         {
  //           path: 'audios',
  //           component: RecordingsComponent,
  //         },
  //         {
  //           path: 'photos',
  //           component: PicturesComponent,
  //         },
  //         {
  //           path: 'videos',
  //           component: VideosComponent,
  //         },
  //         {
  //           path: '',
  //           redirectTo: 'posts',
  //           pathMatch: 'full',
  //         },
  //       ],
  //     },
  //     {
  //       path: 'chats',
  //       component: ChatsComponent,
  //       resolve: [chatGuard],
  //       children: [{ path: ':id', component: ChatComponent }],
  //     },
  //     {
  //       path: 'settings',
  //       component: SettingsComponent,
  //       resolve: [settingsGuard],
  //       children: [
  //         { path: 'info', component: ChatsComponent },
  //         { path: 'media', component: ChatsComponent },
  //         { path: 'relationship', component: ChatsComponent },
  //         { path: 'merge', component: ChatsComponent },
  //       ],
  //     },
  //     { path: '', redirectTo: 'basic', pathMatch: 'full' },
  //   ],
  // },
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
    ChatSmallComponent,
    AuthComponent,
    AppendComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    ButtonComponent,
    SafePipe,
    LinkComponent,
    AdminComponent,
    ChatComponent,
    MediaComponent,
    ForumComponent,
    MatterComponent,
    DiscussionEditComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    UcWidgetModule,
    FontAwesomeModule,
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

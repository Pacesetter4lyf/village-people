import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
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

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'main/individual', component: PersonalComponent },
  {
    path: 'main/lineage',
    component: LineageComponent,
    children: [
      { path: '', component: TreeComponent },
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
      { path: 'tree', component: TreeComponent },
      { path: 'search', component: SearchComponent },
    ],
  },
  { path: '**', component: LandingComponent },

  // {
  //   path: 'main',
  //   component: MainComponent,
  //   children: [
  //     {
  //       path: 'personal',
  //       component: PersonalComponent,
  //       children: [
  //         { path: 'basic', component: BasicComponent },
  //         { path: 'education', component: EducationComponent },
  //         { path: 'bibliography', component: BibliographyComponent },
  //         { path: 'recordings', component: RecordingsComponent },
  //         { path: 'location', component: LocationComponent },
  //         { path: 'pictures', component: PicturesComponent },
  //         { path: 'videos', component: VideosComponent },
  //         { path: 'settings', component: SettingsComponent },
  //       ],
  //     },
  //     { path: 'lineage', component: LineageComponent },
  //   ],
  // },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
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
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [IndividualService],
  bootstrap: [AppComponent],
})
export class AppModule {}

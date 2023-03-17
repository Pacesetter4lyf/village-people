import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PersonalComponent } from './main/personal/personal.component';
import { BasicComponent } from './main/personal/basic/basic.component';
import { EducationComponent } from './main/personal/education/education.component';
import { BibliographyComponent } from './main/personal/bibliography/bibliography.component';
import { RecordingsComponent } from './main/personal/recordings/recordings.component';
import { LocationComponent } from './main/personal/location/location.component';
import { PicturesComponent } from './main/personal/pictures/pictures.component';
import { VideosComponent } from './main/personal/videos/videos.component';
import { LineageComponent } from './main/lineage/lineage.component';
import { TreeComponent } from './main/lineage/tree/tree.component';
import { SearchComponent } from './main/lineage/search/search.component';
import { DiscussionComponent } from './main/lineage/discussion/discussion.component';
import { BirthdaysComponent } from './main/lineage/birthdays/birthdays.component';
import { FundsComponent } from './main/lineage/funds/funds.component';
import { GalleryComponent } from './main/lineage/gallery/gallery.component';
import { AudioComponent } from './main/lineage/gallery/audio/audio.component';
import { PhotosComponent } from './main/lineage/gallery/photos/photos.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { TextInputComponent } from './helper.component/text-input/text-input.component';
import { PersonalHeaderComponent } from './main/personal/personal-header/personal-header.component';
import { LineageHeaderComponent } from './main/lineage/lineage-header/lineage-header.component';
import { SettingsComponent } from './main/personal/settings/settings.component';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'main', component: MainComponent },

  // { path: 'main/personal', component: PersonalComponent },
  // { path: 'main/lineage', component: LineageComponent },

  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'personal',
        component: PersonalComponent,
        children: [
          { path: 'basic', component: BasicComponent },
          { path: 'education', component: EducationComponent },
          { path: 'bibliography', component: BibliographyComponent },
          { path: 'recordings', component: RecordingsComponent },
          { path: 'location', component: LocationComponent },
          { path: 'pictures', component: PicturesComponent },
          { path: 'videos', component: VideosComponent },
          { path: 'settings', component: SettingsComponent },
        ],
      },
      { path: 'lineage', component: LineageComponent },
    ],
  },
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
    LocationComponent,
    PicturesComponent,
    VideosComponent,
    LineageComponent,
    TreeComponent,
    SearchComponent,
    DiscussionComponent,
    BirthdaysComponent,
    FundsComponent,
    GalleryComponent,
    AudioComponent,
    PhotosComponent,
    LandingComponent,
    MainComponent,
    TextInputComponent,
    PersonalHeaderComponent,
    LineageHeaderComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

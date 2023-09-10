import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateFn } from 'src/app/auth/auth-guard.service';
import { PicturesComponent } from 'src/app/shared/pictures/pictures.component';
import { PostsComponent } from 'src/app/shared/posts/posts.component';
import { RecordingsComponent } from 'src/app/shared/recordings/recordings.component';
import { VideosComponent } from 'src/app/shared/videos/videos.component';
import { BasicComponent } from './basic/basic.component';
import { BibliographyComponent } from './bibliography/bibliography.component';
import { EducationComponent } from './education/education.component';
import { settingsGuard } from './individual-guard.service';
import { IndividualResolver } from './individual-resolver.service';
import { MediaComponent } from './media/media.component';
import { PersonalComponent } from './personal.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalComponent,
    canActivate: [canActivateFn],
    resolve: [IndividualResolver],
    children: [
      { path: 'basic', component: BasicComponent },
      { path: 'education', component: EducationComponent },
      { path: 'biography', component: BibliographyComponent },
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
      {
        path: 'settings',
        component: SettingsComponent,
        resolve: [settingsGuard],
      },
      { path: '', redirectTo: 'basic', pathMatch: 'full' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalRoutingModule {}

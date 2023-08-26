import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivateFn } from 'src/app/auth/auth-guard.service';
import { PicturesComponent } from 'src/app/shared/pictures/pictures.component';
import { PostsComponent } from 'src/app/shared/posts/posts.component';
import { RecordingsComponent } from 'src/app/shared/recordings/recordings.component';
import { VideosComponent } from 'src/app/shared/videos/videos.component';
import { IndividualResolver } from '../personal/individual-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { DiscussionEditComponent } from './forum/discussion-edit/discussion-edit.component';
import { ForumComponent } from './forum/forum.component';
import { MatterComponent } from './forum/matter/matter.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LineageComponent } from './lineage.component';
import { LinkComponent } from './link/link.component';
import { SearchComponent } from './search/search.component';
import { TreeComponent } from './tree/tree.component';

const routes: Routes = [
  {
    path: '',
    component: LineageComponent,
    canActivate: [canActivateFn],
    resolve: [IndividualResolver],
    children: [
      { path: '', redirectTo: 'tree', pathMatch: 'full' },
      { path: 'tree', component: TreeComponent },
      { path: 'link', component: LinkComponent },
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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineageRoutingModule {}

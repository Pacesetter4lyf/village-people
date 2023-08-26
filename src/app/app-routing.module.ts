import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { canActivateFn } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './main/lineage/admin/admin.component';
import { BirthdaysComponent } from './main/lineage/birthdays/birthdays.component';
import { DiscussionEditComponent } from './main/lineage/forum/discussion-edit/discussion-edit.component';
import { ForumComponent } from './main/lineage/forum/forum.component';
import { MatterComponent } from './main/lineage/forum/matter/matter.component';
import { GalleryComponent } from './main/lineage/gallery/gallery.component';
import { LineageComponent } from './main/lineage/lineage.component';
import { LinkComponent } from './main/lineage/link/link.component';
import { SearchComponent } from './main/lineage/search/search.component';
import { TreeComponent } from './main/lineage/tree/tree.component';
// import { MainComponent } from './main/main.component';
import { BasicComponent } from './main/personal/basic/basic.component';
import { BibliographyComponent } from './main/personal/bibliography/bibliography.component';
import { EducationComponent } from './main/personal/education/education.component';
import { settingsGuard } from './main/personal/individual-guard.service';
import { IndividualResolver } from './main/personal/individual-resolver.service';
import { MediaComponent } from './main/personal/media/media.component';
import { PersonalComponent } from './main/personal/personal.component';
import { SettingsComponent } from './main/personal/settings/settings.component';
import { PicturesComponent } from './shared/pictures/pictures.component';
import { PostsComponent } from './shared/posts/posts.component';
import { RecordingsComponent } from './shared/recordings/recordings.component';
import { VideosComponent } from './shared/videos/videos.component';
import { PersonalRoutingModule } from './main/personal/personal-routing.module';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  //   {
  //     path: 'main',
  //     component: MainComponent,
  //     canActivate: [canActivateFn],
  //     children: [
  //       {
  //         path: 'lineage',
  //         component: LineageComponent,
  //         canActivate: [canActivateFn],
  //         resolve: [IndividualResolver],
  //         children: [
  //           { path: '', redirectTo: 'tree', pathMatch: 'full' },
  //           { path: 'tree', component: TreeComponent },
  //           { path: 'link', component: LinkComponent },
  //           // { path: 'discussions', component: DiscussionComponent },
  //           // { path: 'discussions/:single', component: SingleComponent },
  //           // { path: 'funds', component: FundsComponent },
  //           { path: 'forum', component: ForumComponent },
  //           { path: 'forum/new', component: DiscussionEditComponent },
  //           { path: 'forum/:id', component: MatterComponent },
  //           { path: 'forum/:id/edit', component: DiscussionEditComponent },
  //           { path: 'birthdays', component: BirthdaysComponent },
  //           { path: 'admin', component: AdminComponent },
  //           {
  //             path: 'media',
  //             component: GalleryComponent,
  //             children: [
  //               {
  //                 path: 'posts',
  //                 component: PostsComponent,
  //               },
  //               {
  //                 path: 'audios',
  //                 component: RecordingsComponent,
  //               },
  //               {
  //                 path: 'photos',
  //                 component: PicturesComponent,
  //               },
  //               {
  //                 path: 'videos',
  //                 component: VideosComponent,
  //               },
  //               {
  //                 path: '',
  //                 redirectTo: 'posts',
  //                 pathMatch: 'full',
  //               },
  //             ],
  //           },
  //           { path: 'search', component: SearchComponent },
  //         ],
  //       },
  //       {
  //         path: 'individual',
  //         component: PersonalComponent,
  //         canActivate: [canActivateFn],
  //         resolve: [IndividualResolver],
  //         children: [
  //           { path: 'basic', component: BasicComponent },
  //           { path: 'education', component: EducationComponent },
  //           { path: 'bibliography', component: BibliographyComponent },
  //           {
  //             path: 'media',
  //             component: MediaComponent,
  //             children: [
  //               {
  //                 path: 'posts',
  //                 component: PostsComponent,
  //               },
  //               {
  //                 path: 'audios',
  //                 component: RecordingsComponent,
  //               },
  //               {
  //                 path: 'photos',
  //                 component: PicturesComponent,
  //               },
  //               {
  //                 path: 'videos',
  //                 component: VideosComponent,
  //               },
  //               {
  //                 path: '',
  //                 redirectTo: 'posts',
  //                 pathMatch: 'full',
  //               },
  //             ],
  //           },
  //           {
  //             path: 'settings',
  //             component: SettingsComponent,
  //             resolve: [settingsGuard],
  //           },
  //           { path: '', redirectTo: 'basic', pathMatch: 'full' },
  //         ],
  //       },
  //       { path: '', redirectTo: 'individual', pathMatch: 'full' },
  //     ],
  //   },

//   {
//     path: 'lineage',
//     component: LineageComponent,
//     canActivate: [canActivateFn],
//     resolve: [IndividualResolver],
//     children: [
//       { path: '', redirectTo: 'tree', pathMatch: 'full' },
//       { path: 'tree', component: TreeComponent },
//       { path: 'link', component: LinkComponent },
//       { path: 'forum', component: ForumComponent },
//       { path: 'forum/new', component: DiscussionEditComponent },
//       { path: 'forum/:id', component: MatterComponent },
//       { path: 'forum/:id/edit', component: DiscussionEditComponent },
//       { path: 'birthdays', component: BirthdaysComponent },
//       { path: 'admin', component: AdminComponent },
//       {
//         path: 'media',
//         component: GalleryComponent,
//         children: [
//           {
//             path: 'posts',
//             component: PostsComponent,
//           },
//           {
//             path: 'audios',
//             component: RecordingsComponent,
//           },
//           {
//             path: 'photos',
//             component: PicturesComponent,
//           },
//           {
//             path: 'videos',
//             component: VideosComponent,
//           },
//           {
//             path: '',
//             redirectTo: 'posts',
//             pathMatch: 'full',
//           },
//         ],
//       },
//       { path: 'search', component: SearchComponent },
//     ],
//   },

//   {
//     path: 'individual',
//     component: PersonalComponent,
//     canActivate: [canActivateFn],
//     resolve: [IndividualResolver],
//     children: [
//       { path: 'basic', component: BasicComponent },
//       { path: 'education', component: EducationComponent },
//       { path: 'bibliography', component: BibliographyComponent },
//       {
//         path: 'media',
//         component: MediaComponent,
//         children: [
//           {
//             path: 'posts',
//             component: PostsComponent,
//           },
//           {
//             path: 'audios',
//             component: RecordingsComponent,
//           },
//           {
//             path: 'photos',
//             component: PicturesComponent,
//           },
//           {
//             path: 'videos',
//             component: VideosComponent,
//           },
//           {
//             path: '',
//             redirectTo: 'posts',
//             pathMatch: 'full',
//           },
//         ],
//       },
//       {
//         path: 'settings',
//         component: SettingsComponent,
//         resolve: [settingsGuard],
//       },
//       { path: '', redirectTo: 'basic', pathMatch: 'full' },
//     ],
//   },
//   { path: 'individual', redirectTo: 'main', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

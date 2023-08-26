import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ButtonComponent } from './modal/button/button.component';
import { PicturesComponent } from './pictures/pictures.component';
import { PostsComponent } from './posts/posts.component';
import { RecordingsComponent } from './recordings/recordings.component';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  declarations: [
    RecordingsComponent,
    PicturesComponent,
    VideosComponent,
    PostsComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
  ],
  imports: [CommonModule],
  exports: [
    RecordingsComponent,
    PicturesComponent,
    VideosComponent,
    PostsComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
    CommonModule,
  ],
})
export class SharedModule {}

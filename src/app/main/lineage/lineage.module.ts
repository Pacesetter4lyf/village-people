import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AppendComponent } from './append/append.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { DiscussionEditComponent } from './forum/discussion-edit/discussion-edit.component';
import { ForumComponent } from './forum/forum.component';
import { MatterComponent } from './forum/matter/matter.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LineageHeaderComponent } from './lineage-header/lineage-header.component';
import { LineageComponent } from './lineage.component';
import { LinkComponent } from './link/link.component';
import { SearchComponent } from './search/search.component';
import { TreeComponent } from './tree/tree.component';
import { LineageRoutingModule } from './lineage-routing.module';


@NgModule({
  declarations: [
    LineageHeaderComponent,
    LineageComponent,
    TreeComponent,
    SearchComponent,
    BirthdaysComponent,
    GalleryComponent,
    ForumComponent,
    MatterComponent,
    DiscussionEditComponent,
    LinkComponent,
    AdminComponent,
    AppendComponent,
  ],
  imports: [RouterModule, FormsModule, CommonModule, LineageRoutingModule],
})
export class LineageModule {}

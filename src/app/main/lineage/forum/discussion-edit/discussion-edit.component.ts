import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PostModel } from '../post.model';
import { PostService } from '../post.service';
import { personRowInterface } from '../../admin/admin.service';

@Component({
  selector: 'app-discussion-edit',
  templateUrl: './discussion-edit.component.html',
  styleUrls: ['./discussion-edit.component.css'],
})
export class DiscussionEditComponent implements OnInit {
  commentFields: PostModel;
  members: personRowInterface[];
  postId: string;
  edit: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.postId = params.id;
      if (this.postId && this.postId !== 'new') {
        this.postService.getPost(this.postId).subscribe((post) => {
          this.commentFields = post;
          this.edit = true;
        });
      } else {
        this.commentFields = new PostModel();
      }
    });

    this.postService.membersList.subscribe((data) => (this.members = data));

    if (
      !(this.postService.userId === this.commentFields.poster.id) &&
      this.edit
    ) {
      this.router.navigate([`../${this.postId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  savePost(formValues: any) {
    // console.log('form values', formValues, this.commentFields);
    const {
      isCommentsTurnedOff,
      file,
      isForPerson,
      personId,
      postBox,
      isNotVisibleByLineage,
      title,
    } = this.commentFields;
    // if for person, then must have name
    if (
      (isForPerson && personId === '') ||
      title.trim() === '' ||
      title === null
    ) {
      // console.log(title);
      return;
    }

    this.postService
      .savePost({ ...this.commentFields, id: this.postId }, this.edit)
      .subscribe({
        next: (data) => {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        },
        error: (error) => {
          console.log(error);
        },
      });
    // navigate to the post
  }

  cancel() {
    // if edit go back to the discussion else go back to the matter lists
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}

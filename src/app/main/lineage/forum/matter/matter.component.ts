import { Component, OnInit } from '@angular/core';
import { PostModel } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: ['./matter.component.css'],
})
export class MatterComponent implements OnInit {
  popupVisible = false;
  post: PostModel;
  postEmitter: Subject<PostModel> = new Subject();
  id: string;
  loaded = false;
  likes: string[];
  isLiked: boolean;
  isCommentEnabled: boolean;
  isLineageResource: boolean;
  isThePoster = false;
  isAdminOfPostersLineage: boolean;
  userId: string;
  adminOf: number[];

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  makePopupVisible() {
    this.popupVisible = !this.popupVisible;
  }
  turnOffVisibility() {
    this.popupVisible = !this.popupVisible;
  }

  editPage(id: string) {
    if (this.postService.userId === this.post.poster.id) {
      this.router.navigate([`../${id}/edit`], { relativeTo: this.route });
    } else {
      alert('you didnt create this post');
    }
  }

  ngOnInit() {
    this.userId = this.postService.userId;
    this.adminOf = this.postService.adminOf;

    this.postEmitter.subscribe((post) => {
      // console.log('returned ', post);
      this.loaded = true;
      this.likes = post.likes;
      this.isLiked = post.likes?.includes(this.postService.userId);
      this.isCommentEnabled = !post.isCommentsTurnedOff;
      this.isLineageResource = post.isLineageResource;
    });

    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.postService.getPost(this.id).subscribe((post) => {
        this.post = post;
        this.postEmitter.next(post);
        // console.log('here');
        // this.loaded = true;
        // this.likes = this.post.likes;
        // this.isLiked = this.post.likes?.includes(this.postService.userId);
        if (
          this.userId === this.post.poster.id
          // ||
          // this.post.poster?.adminableBy?.includes(this.userId)
        ) {
          this.isThePoster = true;
        } else {
          this.isThePoster = false;
        }

        // ehether i admin poster's lineage
        if (
          this.post.poster.lineage.some((item) => this.adminOf.includes(item))
        ) {
          this.isAdminOfPostersLineage = true;
        }
      });
    });
    // console.log('here2');
  }

  postComment(value: string) {
    // console.log(value, 'comment');
    if (value) {
      this.postService.postComment(this.id, value).subscribe((data) => {
        this.post = data;
      });
    }
  }
  liked() {
    const likes = this.post.likes;
    let todo: 'like' | 'unlike';
    if (likes?.includes(this.postService.userId)) {
      todo = 'unlike';
    } else {
      todo = 'like';
    }
    this.postService.editLike(this.id, todo).subscribe((data) => {
      this.likes = data;
      this.post = { ...this.post, ['likes']: data };
      this.isLiked = !this.isLiked;
    });
  }

  enableComment() {
    // const todo = 'enableComment';
    // const value = !this.post.isCommentsTurnedOff;
    // const userId = this.postService.userId;
    if (this.isThePoster) {
      this.postService
        .patchPost(this.id, 'enableComment', !this.post.isCommentsTurnedOff)
        .subscribe((post) => {
          this.post = post;
          this.postEmitter.next(post);
        });
    }
    this.turnOffVisibility();
  }
  lineageResource() {
    if (this.post.poster.lineage?.some((item) => this.adminOf.includes(item))) {
      // i admin posters lineage
      this.postService
        .patchPost(this.id, 'lineageResource', !this.post.isLineageResource)
        .subscribe((post) => {
          this.post = post;
          this.postEmitter.next(post);
        });
    }
    this.turnOffVisibility();
  }
}

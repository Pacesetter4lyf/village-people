import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from './post.service';
import { PostModel } from './post.model';
import { personRowInterface } from '../admin/admin.service';
import { Subscription, pipe, take } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit, OnDestroy {
  allPosts: PostModel[];
  posts: PostModel[];
  constructor(private postService: PostService) {}
  isCreating = false;

  createdForMe = false;
  createdByMe = false;
  createdFor: string = '';

  membersList: personRowInterface[];

  getPostsSub: Subscription
  membersSub: Subscription

  ngOnInit() {
    //get all the pos tcreated for people in the lineage or
    // for people in the lineage
    this.getPostsSub = this.postService.getPosts().subscribe((data) => {
      // const newData = data.map(post => ({...post, dateCreated:  }))
      this.allPosts = [...data];
      this.posts = [...data];
      // console.log(data);
    });

    this.membersSub = this.postService.membersList.pipe(take(2)).subscribe((data) => {
      this.membersList = data;
    });
  }

  showCreatedForMe() {
    if (this.createdForMe) {
      this.createdByMe = false;
      this.createdFor = '';
      this.posts = this.allPosts.filter(
        (post) => post.personId === this.postService.userId // IMPURE
      );
    } else {
      this.posts = [...this.allPosts];
    }
  }
  showCreatedByMe() {
    if (this.createdByMe) {
      this.createdForMe = false;
      this.createdFor = '';
      this.posts = this.allPosts.filter(
        (post) => post.poster.id === this.postService.userId // IMPURE
      );
    } else {
      this.posts = [...this.allPosts];
    }
  }

  createdForChanged() {
    if (this.createdFor === '') {
      this.posts = [...this.allPosts];
    } else {
      this.createdForMe = false;
      this.createdByMe = false;
      this.posts = this.allPosts.filter(
        (post) => post.personId === this.createdFor // IMPURE
      );
    }
  }
  //
  ngOnDestroy(){
    this.getPostsSub.unsubscribe()
    this.membersSub.unsubscribe()
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, map, of, tap } from 'rxjs';
import { respType } from 'src/app/shared/types/response.type';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { PostModel } from './post.model';
import { AdminService, personRowInterface } from '../admin/admin.service';
import { Individual } from '../../personal/individual.model';

import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class PostService {
  posts: PostModel[] = [];
  post: PostModel;
  newPost: PostModel;
  editingPost: PostModel;
  membersList = new BehaviorSubject<personRowInterface[]>(null);
  user: Individual;
  userId: string;
  adminOf: number[];

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private individualService: IndividualService
  ) {
    this.adminService.personListObservable.subscribe((data) => {
      this.membersList.next(data);
    });

    this.userId = this.individualService.actualUser.value._id;
    this.adminOf = this.individualService.actualUser.value.adminOf;
  }

  savePost(postDetails: PostModel, isEditing: boolean) {
    return this.http
      .post<respType<PostModel>>(`${apiUrl}/post`, {
        postDetails,
        isEditing,
      })
      .pipe(
        map((response) => response.data.data),
        tap((data) => {
          this.posts = [data, ...this.posts];
          this.post = data;
        })
      );
  }

  getPosts() {
    if (this.posts.length) return of(this.posts);
    else return this.fetchPosts();
  }

  private fetchPosts() {
    // console.log('fetching posts', this.posts);
    return this.http.get<respType<PostModel[]>>(`${apiUrl}/post`).pipe(
      map((response) => response.data.data),
      tap((data) => {
        this.posts = [...data];
      })
    );
  }

  getPost(id: string) {
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      this.post = post;
      return of(post);
    } else {
      return this.http.get<respType<PostModel>>(`${apiUrl}/post/${id}`).pipe(
        map((response) => response.data.data),
        tap((data) => {
          this.post = data;
          // console.log('post ', this.post);
        })
      );
    }
  }
  postComment(id: string, comment: string) {
    return this.http
      .patch<respType<PostModel>>(`${apiUrl}/post/${id}`, {
        comment,
      })
      .pipe(
        map((response) => response.data.data),
        tap((data) => {
          // console.log('data ...', data);
          // this.post = data;
          const postIndex = this.posts.findIndex((post) => post.id === id);
          if (postIndex) {
            this.posts[postIndex] = data;
          } else {
            this.posts = [...this.posts, data];
          }
        })
      );
  }
  editLike(id: string, like: string) {
    return this.http
      .patch<respType<string[]>>(`${apiUrl}/post/like/${id}`, {
        like: like,
      })
      .pipe(
        map((response) => response.data.data),
        tap((data) => {
          const postIndex = this.posts.findIndex((post) => post.id === id);
          this.post = { ...this.post, ['likes']: data };
          this.posts[postIndex] = this.post;
        })
      );
  }

  patchPost(id: string, todo: string, value: boolean) {
    return this.http
      .patch<respType<PostModel>>(`${apiUrl}/post/patchpost/${id}`, {
        todo,
        value,
      })
      .pipe(
        map((response) => response.data.data),
        tap((data) => {
          const postIndex = this.posts.findIndex((post) => post.id === id);
          this.posts[postIndex] = data;
        })
      );
  }
}

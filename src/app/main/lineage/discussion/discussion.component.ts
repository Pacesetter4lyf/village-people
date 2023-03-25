import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css'],
})
export class DiscussionComponent implements OnInit {
  ngOnInit() {}
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  showPost(postId: string) {
    this.router.navigate([postId], { relativeTo: this.activatedRoute });
  }
}

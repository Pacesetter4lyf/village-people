import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndividualService } from 'src/app/main/personal/individual.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  mediaEditable: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private individualService: IndividualService
  ) {}

  ngOnInit() {
    // this.activatedRoute.params.subscribe(
    //   (params: Params) => (this.mediaEditable = params['mediaEditable'])
    // );
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }

    this.individualService.addMediaContentType.next('text');
  }

  ngOnDestroy() {
    // this.individualService.addMediaContentType.next('media');
  }
}

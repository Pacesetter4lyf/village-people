import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
})
export class VideosComponent implements OnInit {
  mediaEditable: boolean = true;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // this.activatedRoute.params.subscribe(
    //   (params: Params) => (this.mediaEditable = params['mediaEditable'])
    // );
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }
  }
}

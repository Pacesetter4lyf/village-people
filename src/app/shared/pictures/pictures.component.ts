import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css'],
})
export class PicturesComponent implements OnInit {
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

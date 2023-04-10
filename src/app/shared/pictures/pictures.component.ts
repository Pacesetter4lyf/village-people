import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { IndividualService } from 'src/app/main/personal/individual.service';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css'],
})
export class PicturesComponent implements OnInit {
  mediaEditable: boolean = true;
  constructor(private activatedRoute: ActivatedRoute, private individualService: IndividualService) {}

  ngOnInit() {
    // this.activatedRoute.params.subscribe(
    //   (params: Params) => (this.mediaEditable = params['mediaEditable'])
    // );
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }
    this.individualService.addMediaContentType.next('image');
  }
  
}

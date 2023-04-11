import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  BasicDetailsInterface,
  IndividualService,
} from 'src/app/main/personal/individual.service';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css'],
})
export class RecordingsComponent implements OnInit {
  mediaEditable: boolean = true;
  audios: BasicDetailsInterface['resource'];
  audiosSub: Subscription;
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
    this.individualService.addMediaContentType.next('audio');

    this.audiosSub = this.individualService.displayUser.subscribe(
      (value) =>
        (this.audios = value.resource.filter(
          (resource) => resource.resourceType === 'audio'
        ))
        
    );
  }

  ngOnDestroy() {
    this.audiosSub.unsubscribe();
  }

  showModal() {
    this.individualService.showModal.next(true);
  }
}

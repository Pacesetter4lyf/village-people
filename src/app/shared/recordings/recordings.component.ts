import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from 'src/app/main/personal/display-user.model';
import {
  BasicDetailsInterface,
  IndividualService,
} from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';

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
    private individualService: IndividualService,
    private resourceService: ResourceService,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }
    this.resourceService.addMediaContentType.next('audio');

    this.audiosSub = this.resourceService.resources.subscribe(
      (resources) =>
        (this.audios = resources.filter(
          (resource) => resource.resourceType === 'audio'
        ))
    );
  }

  ngOnDestroy() {
    this.audiosSub.unsubscribe();
  }

  onEdit(id: string) {
    this.resourceService.mode.next(id);
  }
  onDelete(id: string) {
    this.resourceService.deleteResource(id);
  }
}

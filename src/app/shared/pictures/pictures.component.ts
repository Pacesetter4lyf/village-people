import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from 'src/app/main/personal/display-user.model';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css'],
})
export class PicturesComponent implements OnInit {
  mediaEditable: boolean = true;
  imagesSub: Subscription;
  images: Resource[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private individualService: IndividualService
  ) {}

  ngOnInit() {
    this.mediaEditable = this.resourceService.getMediaEditable();
    this.resourceService.addMediaContentType.next('image');

    this.imagesSub = this.resourceService.resources.subscribe(
      (resources) =>
        (this.images = resources.filter(
          (resource) => resource.resourceType === 'image'
        ))
    );
  }

  ngOnDestroy() {
    this.imagesSub.unsubscribe();
  }

  onEdit(id: string) {
    this.resourceService.mode.next(id);
    // this.individualService.showModal.next(true);
  }
  onDelete(id: string) {
    this.resourceService.deleteResource(id);
  }
}

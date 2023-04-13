import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../modal/resource.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
})
export class VideosComponent implements OnInit {
  mediaEditable: boolean = true;
  videos;
  videosSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }
    this.resourceService.addMediaContentType.next('video');

    this.videosSub = this.resourceService.resources.subscribe(
      (resources) =>
        (this.videos = resources.filter(
          (resource) => resource.resourceType === 'video'
        ))
    );
  }

  ngOnDestroy() {
    this.videosSub.unsubscribe();
  }
}

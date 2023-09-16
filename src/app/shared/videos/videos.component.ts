import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, of, switchMap, take, tap } from 'rxjs';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../store/resource.actions';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
})
export class VideosComponent implements OnInit {
  mediaEditable: boolean = true;
  videos: Resource[];
  videosSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private store: Store<frmApp.AppState>
  ) {}

  ngOnInit() {
    this.videosSub = this.activatedRoute.parent?.data
      .pipe(
        take(1),
        switchMap((data) => {
          const inLineage = data['lineage'];
          return this.store.select('resource').pipe(
            take(1),
            tap((data) => (this.mediaEditable = data.mediaEditable)),
            map((resource) =>
              inLineage ? resource.lineageResource : resource.individualResource
            )
          );
        })
      )
      .subscribe((data) => {
        this.videos = data?.filter(
          (resource) => resource.resourceType === 'video'
        );
      });

    this.store.dispatch(
      ResourceActions.changeActiveResource({ resourceType: 'video' })
    );
  }

  ngOnDestroy() {
    this.videosSub.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Subscription, map, of, switchMap, take, tap } from 'rxjs';
import { DisplayUserModel } from 'src/app/main/personal/display-user.model';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../store/resource.actions';

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
    private individualService: IndividualService,
    private store: Store<frmApp.AppState>
  ) {}

  ngOnInit() {
    this.imagesSub = this.activatedRoute.parent?.data
      .pipe(
        take(1),
        switchMap((data) => {
          const inLineage = data['lineage'];
          return this.store.select('resource').pipe(
            tap((data) => (this.mediaEditable = data.mediaEditable)),
            map((resource) =>
              inLineage ? resource.lineageResource : resource.individualResource
            )
          );
        })
      )
      .subscribe((data) => {
        this.images = data?.filter(
          (resource) => resource.resourceType === 'image'
        );
      });

    this.store.dispatch(
      ResourceActions.changeActiveResource({ resourceType: 'image' })
    );
  }

  ngOnDestroy() {
    this.imagesSub.unsubscribe();
  }

  onEdit(id: string) {
    this.store.dispatch(ResourceActions.prepareModalEdit({ id }));
  }
  onDelete(id: string) {
    this.resourceService.deleteResource(id);
  }
}

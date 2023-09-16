import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, of, switchMap, take, tap } from 'rxjs';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../store/resource.actions';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  mediaEditable: boolean = false;
  texts: Resource[];
  textSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private store: Store<frmApp.AppState>
  ) {}

  ngOnInit() {
    this.textSub = this.activatedRoute.parent?.data
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
        this.texts = data?.filter(
          (resource) => resource.resourceType === 'text'
        );
      });

    this.store.dispatch(
      ResourceActions.changeActiveResource({ resourceType: 'text' })
    );
  }

  onDelete(id: string) {
    this.resourceService.deleteResource(id);
  }
  onEdit(id: string) {
    this.store.dispatch(ResourceActions.prepareModalEdit({ id }));
  }

  ngOnDestroy() {
    this.textSub.unsubscribe();
  }
}

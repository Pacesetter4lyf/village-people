import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, of, switchMap, take, tap } from 'rxjs';
import { DisplayUserModel } from 'src/app/main/personal/display-user.model';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../store/resource.actions';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css'],
})
export class RecordingsComponent implements OnInit {
  mediaEditable: boolean = true;
  audios: Resource[];
  audiosSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private individualService: IndividualService,
    private resourceService: ResourceService,
    private appRef: ApplicationRef,
    private store: Store<frmApp.AppState>
  ) {}

  ngOnInit() {
    this.audiosSub = this.activatedRoute.parent?.data
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
        this.audios = data?.filter(
          (resource) => resource.resourceType === 'audio'
        );
      });

    this.store.dispatch(
      ResourceActions.changeActiveResource({ resourceType: 'audio' })
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/shared/resource.service';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../../../shared/store/resource.actions';
import { Subscription, switchMap, take, tap } from 'rxjs';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css'],
})
export class MediaComponent implements OnInit, OnDestroy {
  resSub: Subscription;
  mediaEditable: boolean;
  constructor(private store: Store<frmApp.AppState>) {}
  ngOnInit() {
    this.resSub = this.store
      .select('individual')
      .pipe(take(1))
      .subscribe((data) => {
        const mode = data.mode;
        if (
          mode === 'user-creating' ||
          mode === 'self' ||
          mode === 'user-viewing'
        ) {
          this.store.dispatch(
            ResourceActions.changeMediaEditable({ mediaEditable: true })
          );
          this.mediaEditable = true;
        } else {
          this.store.dispatch(
            ResourceActions.changeMediaEditable({ mediaEditable: false })
          );
          this.mediaEditable = false;
        }
      });
  }

  addNew() {
    this.store.dispatch(ResourceActions.openModalCreate());
  }

  ngOnDestroy(): void {
    this.resSub.unsubscribe();
  }
}

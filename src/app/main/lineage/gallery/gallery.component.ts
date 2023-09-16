import { Component, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../../../shared/store/resource.actions';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  resSub: Subscription;
  constructor(private store: Store<frmApp.AppState>) {}
  ngOnInit() {
    this.resSub = this.store
      .select('individual')
      .pipe(take(1))
      .subscribe((data) => {
        this.store.dispatch(
          ResourceActions.changeMediaEditable({ mediaEditable: false })
        );
      });
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
  }
}

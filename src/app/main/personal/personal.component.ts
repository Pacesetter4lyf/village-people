import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceService } from 'src/app/shared/resource.service';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit, OnDestroy {
  selected: string = 'Basic';
  dataLoaded = true;
  clickSub: Subscription;
  userSub: Subscription;
  displayMode: string;
  storeSub: Subscription;

  constructor(private store: Store<frmApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('individual').subscribe((individual) => {
      this.displayMode = individual.mode;
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}

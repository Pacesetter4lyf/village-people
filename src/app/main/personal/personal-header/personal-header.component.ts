import { Component, OnInit, OnDestroy } from '@angular/core';
import * as frmApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-header',
  templateUrl: './personal-header.component.html',
  styleUrls: ['./personal-header.component.css'],
})
export class PersonalHeaderComponent implements OnInit, OnDestroy {
  selected = 'Basic';

  constructor(private store: Store<frmApp.AppState>) {}

  tabs = [];
  allTabs: string[] = ['Basic', 'Education', 'Biography', 'Media', 'Settings'];
  mode: string;
  isRegistered: boolean;
  storeSub: Subscription;

  ngOnInit() {
    this.storeSub = this.store
      .select('individual')
      .subscribe((individualData) => {
        this.mode = individualData.mode;
        // console.log(individualData.mode);
        if (this.mode === 'self') {
          this.tabs = [...this.allTabs];
        } else if (
          this.mode === 'user-creating' ||
          this.mode === 'registering'
        ) {
          this.tabs = [this.allTabs[0]];
        } else if (this.mode === 'user-viewing') {
          this.tabs = [...this.allTabs];
        } else {
          this.tabs = this.allTabs.slice(0, 4);
        }
      });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/shared/resource.service';

import { Resource } from 'src/app/shared/resource.model';


import * as frmApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as SettingsActions from './store/settings.actions';
import { Subscription, take } from 'rxjs';
import { SettingsInterface } from './store/settings.reducer';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  userFields: SettingsInterface[];
  resourceFields: SettingsInterface[];
  viewables: SettingsInterface[];
  userId: string;

  media = ['text', 'image', 'audio', 'video'];
  selected = 'info';
  selectedMedia = 'text';
  settingsSub: Subscription;
  userSub: Subscription;

  constructor(
    private store: Store<frmApp.AppState>
  ) {}
  ngOnInit() {
    // get the setting from the backend

    this.settingsSub = this.store
      .select('settings')
      .subscribe((settingsData) => {
        this.userFields = settingsData.userFields;
        this.resourceFields = settingsData.resourceFields;
        this.selected = settingsData.selected;
        this.selectedMedia = settingsData.selectedMedia;
        // this.userId = settingsData.
        if (settingsData.selected === 'info') {
          this.viewables = [...this.userFields];
        } else {
          this.viewables = [...this.resourceFields];
        }
      });
    this.userSub = this.store
      .select('individual')
      .subscribe((individualData) => {
        this.userId = individualData.displayUser._id;
      });
  }

  onChange(tab: string) {
    this.store.dispatch(SettingsActions.changeSelectedTab({ selected: tab }));
  }

  changeMedia(media: string) {
    this.store.dispatch(
      SettingsActions.changeSelectedMedia({ selectedMedia: media })
    );
  }

  async logChange(checkboxName: any, id: any, checked: any, event: Event) {
    event.preventDefault();
    if (this.selected === 'info') {
      this.store.dispatch(
        SettingsActions.beginPatchUserFields({
          id: this.userId,
          name: id,
          visibility: checked ? checkboxName : 'self',
        })
      );
    } else {
      this.store.dispatch(
        SettingsActions.beginPatchResourceFields({
          id: id,
          visibility: checked ? checkboxName : 'self',
        })
      );
    }
  }
  ngOnDestroy() {
    this.settingsSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}

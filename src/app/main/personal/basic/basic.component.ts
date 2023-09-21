import { Component, OnDestroy, OnInit } from '@angular/core';
import { DisplayModeType, IndividualService } from '../individual.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from '../display-user.model';
import { Individual } from '../individual.model';
import { BasicDetailsInterface } from '../individual.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as IndividualActions from '../store/individual.actions';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css'],
})
export class BasicComponent implements OnInit, OnDestroy {
  viewMode = true; // are we viewing or editing
  basicDetails: BasicDetailsInterface;
  id: string;
  isLoading: false;
  photo: File;
  userSub: Subscription;
  isEditable: Boolean;
  storeSub: Subscription;
  mode: DisplayModeType;
  appendAsWhat: string;
  appendTo: string;

  constructor(private store: Store<frmApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store
      .select('individual')
      .subscribe((individualData) => {
        if (individualData.mode === 'self')
          this.basicDetails = individualData.actualUser;
        else this.basicDetails = individualData.displayUser;

        this.mode = individualData.mode;
        this.appendAsWhat = individualData.appendAsWhat;
        this.appendTo = individualData.appendTo;

        this.viewMode =
          this.mode !== 'user-creating' && this.mode !== 'registering';
        if (
          this.mode === 'user-creating' ||
          this.mode === 'user-viewing' ||
          this.mode === 'self' ||
          this.mode === 'registering'
        ) {
          this.isEditable = true;
        } else {
          this.isEditable = false;
        }
      });
  }

  changeMode(mode: string) {
    this.viewMode = !this.viewMode;
  }

  onFileChange(event: { target: { files: File } }) {
    this.photo = event.target.files[0];
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const infoToSend = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      gender: form.value.gender,
      dateOfBirth: form.value.dateOfBirth,
      phoneNumber: form.value.phoneNumber,
      facebook: form.value.facebook,
      address: form.value.address,
      photo: this.photo,
    } as BasicDetailsInterface;

    const basicFormData = new FormData();
    Object.keys(infoToSend).map((key) => {
      if (infoToSend[key]) {
        basicFormData.append(key, infoToSend[key]);
      }
    });

    if (this.mode === 'registering') {
      basicFormData.append('mode', 'self');
      this.store.dispatch(
        IndividualActions.beginCreateUser({
          individual: basicFormData,
          isSelf: true,
        })
      );
    } else if (this.mode === 'self') {
      this.store.dispatch(
        IndividualActions.beginPatchUser({
          individual: basicFormData,
          isSelf: true,
          id: this.basicDetails._id,
        })
      );
    } else if (this.mode === 'user-creating') {
      basicFormData.append('mode', 'other');
      basicFormData.append('appendAs', this.appendAsWhat);
      basicFormData.append('appendTo', this.appendTo);
      this.store.dispatch(
        IndividualActions.beginCreateUser({
          individual: basicFormData,
          isSelf: false,
        })
      );
    } else if (this.mode === 'user-viewing') {
      this.store.dispatch(
        IndividualActions.beginPatchUser({
          individual: basicFormData,
          isSelf: false,
          id: this.basicDetails._id,
        })
      );
    }
    this.viewMode = !this.viewMode;
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}

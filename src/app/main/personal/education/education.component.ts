import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from '../display-user.model';
import { DisplayModeType } from '../individual.service';
import { BasicDetailsInterface } from '../individual.model';
import * as frmApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as IndividualActions from '../store/individual.actions';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  viewMode = true;
  mode: DisplayModeType;
  isEditable: boolean;
  data: BasicDetailsInterface;
  storeSub: Subscription;
  constructor(private store: Store<frmApp.AppState>) {}

  changeMode() {
    this.viewMode = !this.viewMode;
  }
  ngOnInit() {
    this.storeSub = this.store
      .select('individual')
      .subscribe((individualData) => {
        if (individualData.mode === 'self')
          this.data = individualData.actualUser;
        else this.data = individualData.displayUser;

        this.mode = individualData.mode;
        this.viewMode = this.mode !== 'user-creating';

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
  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const education = {
      primarySchool: form.value.primarySchool,
      secondarySchool: form.value.secondarySchool,
      tertiarySchool: form.value.tertiarySchool,
    } as BasicDetailsInterface;

    
    const basicFormData = new FormData();
    basicFormData.append('primarySchool', education.primarySchool);
    basicFormData.append('secondarySchool', education.secondarySchool);
    basicFormData.append('tertiarySchool', education.tertiarySchool);

    if (this.mode === 'self') {
      this.store.dispatch(
        IndividualActions.beginPatchUser({
          individual: basicFormData,
          isSelf: true,
          id: this.data._id,
        })
      );
    } else if (this.mode === 'user-viewing') {
      this.store.dispatch(
        IndividualActions.beginPatchUser({
          individual: basicFormData,
          isSelf: false,
          id: this.data._id,
        })
      );
    }
    this.viewMode = !this.viewMode;
  }
}

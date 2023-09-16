import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayModeType, IndividualService } from '../individual.service';
import { BasicDetailsInterface } from '../individual.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as IndividualActions from '../store/individual.actions';

@Component({
  selector: 'app-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.css'],
})
export class BibliographyComponent {
  isEditable = false;
  viewMode = true;
  mode: DisplayModeType;
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
    const bibliography: string = form.value.bibliography;
    const basicFormData = new FormData();
    basicFormData.append('bibliography', bibliography);

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

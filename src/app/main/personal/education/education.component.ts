import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from '../display-user.model';
import { IndividualService } from '../individual.service';
import { BasicDetailsInterface } from '../individual.model';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  viewMode = true;
  isEditable: boolean;
  data: BasicDetailsInterface;
  userSub: Subscription;
  constructor(private individualService: IndividualService) {}

  changeMode(mode: string) {
    this.viewMode = !this.viewMode;
  }
  ngOnInit() {
    this.userSub = this.individualService.displayUser.subscribe(
      (user) => (this.data = user)
    );
    this.individualService.displayMode.subscribe((mode) => {
      if (
        mode === 'user-creating' ||
        mode === 'user-viewing' ||
        mode === 'self'
      ) {
        this.isEditable = true;
      } else {
        this.isEditable = false;
      }
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.individualService.sendBasicDetails({
      primarySchool: form.value.primarySchool
        ? (form.value.primarySchool as string)
        : '',
      secondarySchool: form.value.secondarySchool
        ? (form.value.secondarySchool as string)
        : '',
      tertiarySchool: form.value.tertiarySchool
        ? (form.value.tertiarySchool as string)
        : '',
    });
    this.viewMode = !this.viewMode;
  }
}

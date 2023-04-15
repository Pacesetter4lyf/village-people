import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  BasicDetailsInterface,
  IndividualService,
} from '../individual.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  viewMode = true;
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
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.individualService.sendBasicDetails({
      primarySchool: form.value.primarySchool ? form.value.primarySchool : '',
      secondarySchool: form.value.secondarySchool
        ? form.value.secondarySchool
        : '',
      tertiarySchool: form.value.tertiarySchool
        ? form.value.tertiarySchool
        : '',
    });
  }
}

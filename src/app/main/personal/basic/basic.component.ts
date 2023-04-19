import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BasicDetailsInterface,
  IndividualService,
} from '../individual.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from '../display-user.model';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css'],
})
export class BasicComponent implements OnInit, OnDestroy {
  viewMode = true;
  basicDetails: BasicDetailsInterface;
  id: string;
  isLoading: false;
  photo: File;
  userSub: Subscription;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.userSub = this.individualService.displayUser.subscribe(
      (user) => (this.basicDetails = user)
    );
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
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
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
      facebook,
      address,
    } = form.value;

    this.basicDetails = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
      facebook,
      address,
      photo: this.photo,
    };
    this.individualService.sendBasicDetails(this.basicDetails);
    console.log(form.value, this.basicDetails);
  }
}

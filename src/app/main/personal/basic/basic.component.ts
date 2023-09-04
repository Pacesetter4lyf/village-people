import { Component, OnDestroy, OnInit } from '@angular/core';
import { IndividualService } from '../individual.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayUserModel } from '../display-user.model';
import { Individual } from '../individual.model';
import { BasicDetailsInterface } from '../individual.model';

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
  isEditable: Boolean;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.userSub = this.individualService.displayUser.subscribe(
      (user) => (this.basicDetails = user)
    );

    const viewMode = this.individualService.displayMode.value;
    if (viewMode === 'user-creating') {
      this.viewMode = false;
    }

    this.individualService.displayMode.subscribe((mode) => {
      if (
        mode === 'user-creating' ||
        mode === 'user-viewing' ||
        mode === 'self' ||
        mode === 'registering'
      ) {
        this.isEditable = true;
      } else {
        this.isEditable = false;
      }
    });
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

    const infoToSend  = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
      facebook,
      address,
      photo: this.photo,
    };
    this.individualService.sendBasicDetails(infoToSend);
    this.viewMode = !this.viewMode;
  }
}

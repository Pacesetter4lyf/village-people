import { Component, OnInit } from '@angular/core';
import { BasicDetailsInterface, IndividualService } from '../individual.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css'],
})
export class BasicComponent implements OnInit {
  viewMode = true;
  basicDetails: BasicDetailsInterface;
  id: string;
  isLoading: false;
  photo: File;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    // get the very user or a other user either from url or route params and fetch from db
    this.id = '1234';
    this.individualService.getBasicData(this.id).subscribe((data) => {});
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
    this.individualService.sendBasicDetails(this.basicDetails).subscribe(()=>console.log('hello'))
    console.log(form.value, this.basicDetails);
  }
}

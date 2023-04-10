import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BasicDetailsInterface, IndividualService } from '../individual.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  viewMode = true;
  data: BasicDetailsInterface
  constructor(private individualService: IndividualService) {}


  changeMode(mode: string) {
    this.viewMode = !this.viewMode;
  }
  ngOnInit(){
    this.data = this.individualService.displayUser
  }
    

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.individualService.sendBasicDetails({
      primarySchool: form.value.primarySchool,
      secondarySchool: form.value.secondarySchool,
      tertiarySchool: form.value.tertiarySchool,
    });
  }
}

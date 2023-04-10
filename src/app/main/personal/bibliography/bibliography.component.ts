import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BasicDetailsInterface,
  IndividualService,
} from '../individual.service';

@Component({
  selector: 'app-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.css'],
})
export class BibliographyComponent {
  viewMode = true;
  data: BasicDetailsInterface;
  constructor(private individualService: IndividualService) {}

  changeMode(mode: string) {
    this.viewMode = !this.viewMode;
  }
  ngOnInit() {
    this.data = this.individualService.displayUser;
  }

  onSubmit(form: NgForm) {
    this.individualService.sendBasicDetails({
      bibliography: form.value.bibliography,
    });
    this.viewMode = !this.viewMode;
  }
}

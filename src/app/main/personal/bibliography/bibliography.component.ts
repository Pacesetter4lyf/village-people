import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
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
    this.individualService.sendBasicDetails({
      bibliography: form.value.bibliography,
    });
    this.viewMode = !this.viewMode;
  }
}

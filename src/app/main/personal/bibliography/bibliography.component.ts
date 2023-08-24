import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IndividualService } from '../individual.service';
import { BasicDetailsInterface } from '../individual.model';

@Component({
  selector: 'app-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.css'],
})
export class BibliographyComponent {
  isEditable = false;
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
    this.individualService.sendBasicDetails({
      bibliography: form.value.bibliography,
    });
    this.viewMode = !this.viewMode;
  }
}

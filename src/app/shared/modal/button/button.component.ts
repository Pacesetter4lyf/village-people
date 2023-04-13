import { Component, Input } from '@angular/core';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-modal-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() mediaEditable: boolean;
  constructor(
    private individualService: IndividualService,
    private resourceService: ResourceService
  ) {}

  onClick() {
    this.resourceService.mode.next('create')
  }
}

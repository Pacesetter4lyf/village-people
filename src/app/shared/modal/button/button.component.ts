import { Component, Input } from '@angular/core';
import { ResourceService } from '../../resource.service';

@Component({
  selector: 'app-modal-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() mediaEditable: boolean;
  constructor(
    private resourceService: ResourceService
  ) {}

  onClick() {
    this.resourceService.mode.next('create');
  }
}

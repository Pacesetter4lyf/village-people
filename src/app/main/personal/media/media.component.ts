import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/shared/resource.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css'],
})
export class MediaComponent implements OnInit {
  constructor(private resourceService: ResourceService) {}
  ngOnInit() {
    // set resource service to individual
    this.resourceService.setResource('individual')
    // set mediaEditable
  }
}

import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/shared/modal/resource.service';

@Component({
  selector: 'app-lineage',
  templateUrl: './lineage.component.html',
  styleUrls: ['./lineage.component.css'],
})
export class LineageComponent implements OnInit {
  constructor(private resourceService: ResourceService) {}
  ngOnInit() {
    this.resourceService.viewingIndividual.next(false);
    // this.resourceService.initializeResources('lineage');
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from 'src/app/shared/resource.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  constructor(private resourceService: ResourceService) {}
  ngOnInit() {
    // set resource service to individual
    this.resourceService.setResource('lineage');
    // set mediaEditable
  }
}

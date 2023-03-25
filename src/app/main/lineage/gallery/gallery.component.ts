import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  mediaEditable = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router){
    activatedRoute.snapshot.params['<parameter-name>']
  }
}

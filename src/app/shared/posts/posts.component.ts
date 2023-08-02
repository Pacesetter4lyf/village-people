import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  mediaEditable: boolean = true;
  texts;
  textSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.isEditable === false) {
      this.mediaEditable = false;
    }

    this.resourceService.addMediaContentType.next('text');

    this.textSub = this.resourceService.resources.subscribe(
      (resources) =>
        (this.texts = resources.filter(
          (resource) => resource.resourceType === 'text'
        ))
    );
  }

  onDelete(id: string) {
    this.resourceService.deleteResource(id);
  }
  onEdit(id: string) {
    this.resourceService.mode.next(id);
  }

  ngOnDestroy() {
    this.textSub.unsubscribe();
  }
}

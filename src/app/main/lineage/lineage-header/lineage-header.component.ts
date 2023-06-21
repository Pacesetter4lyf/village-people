import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  UrlSegment,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-lineage-header',
  templateUrl: './lineage-header.component.html',
  styleUrls: ['./lineage-header.component.css'],
})
export class LineageHeaderComponent {
  tabs = [
    'Tree',
    'Link',
    'Admin',
    'Media',
    'Search',
    'Funds',
    'Birthdays',
    'Discussions',
  ];
}

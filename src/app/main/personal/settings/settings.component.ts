import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  inRelationship = false;
  media = ['posts', 'photos', 'audio', 'video'];

  selected = 'info';
  selectedMedia = 'posts';

  onChange(tab: string) {
    this.selected = tab;
  }

  changeMedia(media: string) {
    this.selectedMedia = media;
  }

  viewables = [
    'firstName',
    'lastName',
    'nickname',
    'dateOfBirth',
    'phoneNumber',
    'email',
    'gender',
    'image',
    'description',
    'currentAddress',
    'postalCode',
    'countryOfBirth',
    'state',
    'vilage',
    'lga',
    'facebookAddress',
    'primarySchool',
    'secondarySchool',
    'tertiary',
  ];
  arrayLike = ['editableBy'];
}

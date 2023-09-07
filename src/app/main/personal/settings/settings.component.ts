import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/shared/resource.service';
import { SettingsService } from './settings.service';
import { Resource } from 'src/app/shared/resource.model';

import { SettingsInterface } from './settings.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  userFields: SettingsInterface[];
  resourceFields: SettingsInterface[];
  viewables: SettingsInterface[];

  media = ['text', 'image', 'audio', 'video'];
  selected = 'info';
  selectedMedia = 'text';

  constructor(
    private resourceService: ResourceService,
    private settingsService: SettingsService
  ) {}
  ngOnInit() {
    // get the setting from the backend
    this.settingsService.getUserFields().subscribe((data) => {
      this.userFields = data
        .map((obj) => {
          const [name, value] = Object.entries(obj)[0];
          return { name, value, id: name };
        })
        .filter((item) => item.id !== 'id');

      this.viewables = this.userFields;
    });
    this.settingsService.getResourceFields().subscribe((data) => {
      this.resourceFields = data.map((item) => ({
        name: item.name,
        value: item.viewableBy,
        id: item._id,
        type: item.resourceType,
      }));
    });
    // also get the userResources from the resource service
  }

  onChange(tab: string) {
    this.selected = tab;
    // change the viewables here as well
    if (tab === 'info') this.viewables = [...this.userFields];
    if (tab === 'media')
      this.viewables = this.resourceFields.filter(
        (res) => res.type === this.selectedMedia
      );
  }

  changeMedia(media: string) {
    this.selectedMedia = media;
    this.viewables = this.resourceFields.filter((res) => res.type === media);
  }

  async logChange(checkboxName: any, id: any, checked: any, event: any) {

    const viewableIndex = this.viewables.findIndex(
      (viewable) => viewable.id === id
    );
    const resourceFieldIndex = this.resourceFields.findIndex(
      (resfield) => resfield.id === id
    );
    let viewable = this.viewables[viewableIndex];
    // if we are turning on proceed ortherwise we want 'self'

    const processedResult = await this.settingsService.updateVisibility(
      this.selected,
      viewable.id,
      checkboxName,
      checked,
      viewable.name
    );
    if (processedResult !== 'success') return;
    if (checked) {
      // send to cloud here before you update anything
      viewable.value = checkboxName;
      this.viewables[viewableIndex] = viewable;

      if (this.selected === 'info') {
        this.userFields[viewableIndex] = viewable;
        // make a patch to the cloud
      } else {
        this.resourceFields[resourceFieldIndex] = viewable;
        // send checkbox name to cloud
      }
    } else {
      viewable.value = 'self';
      this.viewables[viewableIndex] = viewable;
      if (this.selected === 'info') {
        this.userFields[viewableIndex] = viewable;
        // send self to settings
      } else {
        this.resourceFields[resourceFieldIndex] = viewable;
        // send self to resources
      }
    }
  }

  handleCheckboxChange(checkboxName: any, id: any, checked: any) {
    // console.log('new value ', checked, checkboxName);
    // console.log(checkboxName, id, checked);
    // console.log(this.viewables);
  }
}

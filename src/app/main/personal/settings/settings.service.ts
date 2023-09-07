import { ResourceService } from 'src/app/shared/resource.service';
import { IndividualService } from '../individual.service';
import { firstValueFrom, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resource } from 'src/app/shared/resource.model';
import { HttpClient } from '@angular/common/http';
import { respType } from 'src/app/shared/types/response.type';

import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

export interface SettingsInterface {
  name: string;
  value: string;
  id: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private displayId: string;
  constructor(
    private individualService: IndividualService,
    private resourceService: ResourceService,
    private http: HttpClient
  ) {
    this.individualService.displayUser.subscribe((data) => {
      // console.log('user changed in settings');
      if (data) {
        this.displayId = data._id;
      }
    });
  }
  resources: Resource[];

  getUserFields() {
    return this.http
      .get<respType<{ [key: string]: string }[]>>(
        `${apiUrl}/userdata/settings/${this.displayId}`
      )
      .pipe(map((response) => response.data.data));
  }
  getResourceFields() {
    return this.resourceService.getDUResources();
  }
  // this.selected, viewable.id, checkboxName, checked
  async updateVisibility(
    infoOrMedia: string,
    id: string,
    checkboxName: string,
    checked: boolean,
    name: string
  ) {
    const visibility = checked ? checkboxName : 'self';
    const url =
      infoOrMedia === 'info'
        ? `${apiUrl}/userdata/settings/`
        : `${apiUrl}/resource/`;
    const destinationId = infoOrMedia === 'info' ? this.displayId : id;
    const visibilityName = infoOrMedia === 'info' ? name : 'viewableBy';

    try {
      const response = await firstValueFrom(
        this.http.patch<respType<string>>(`${url}${destinationId}`, {
          [visibilityName]: visibility,
        })
      );
      return response.status; // Return the HTTP response data
    } catch (error) {
      console.error('Error updating visibility:', error);
      throw error; // Rethrow the error for handling at a higher level
    }
  }
}

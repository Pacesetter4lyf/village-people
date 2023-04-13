import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ResourceService } from 'src/app/shared/modal/resource.service';

export const ResourceResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // console.log('ello');
  let lineageResources = inject(ResourceService).lineageResources;
  if (lineageResources) {
    return true;
  }
  return inject(ResourceService).fetchAllResources();
};

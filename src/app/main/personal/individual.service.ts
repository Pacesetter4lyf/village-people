import { EventEmitter } from '@angular/core';
import { Individual } from './individual.model';

export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();

}

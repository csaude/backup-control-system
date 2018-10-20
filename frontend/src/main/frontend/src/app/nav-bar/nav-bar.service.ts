/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** 
* @author Damasceno Lopes
*/
@Injectable()
export class NavbarService {

  invokeEvent: Subject<any> = new Subject();

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }
}
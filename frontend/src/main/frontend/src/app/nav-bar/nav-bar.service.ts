import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavbarService {

  invokeEvent: Subject<any> = new Subject();

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }

}
/**
 * Created by damasceno.lopes
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as myGlobals from 'globals';
@Injectable()
export class LoginsService {
  public url: string = myGlobals.API_users;
  constructor(public http: Http) {
  }
  getUser(usercreds) {
    var headers: any = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(usercreds.username + ':' + usercreds.password));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getUserUrl()+"authenticate", { headers: headers })
      .map(res => res.json());
  }
  public getUserUrl() {
    return this.url;
  }
}
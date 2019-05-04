/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs/Subject';

/** 
* @author Damasceno Lopes
*/
@Injectable()
export class DistrictsService {

  public url: string = myGlobals.API;
  invokeEvent: Subject<any> = new Subject();

  constructor(public http: Http) {
  }


  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }

  findOneDistrictByUuid(uid, fields) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/districts/" + uid + "?fields=" + fields, { headers: headers })
      .map(res => res.json());
  }

  findDistricts(page, size, name, canceled, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/districts?fields=" + fields + "&filter=name:like:" + name + ",canceled:eq:" + canceled + ",user!user&page=" + page + "&pageSize=" + size + "&order=+parent.name,+name", { headers: headers })
      .map(res => res.json());
  }

  createDistrict(district) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/v1/districts", JSON.stringify(district), { headers: headers });
  }

  updateDistrict(district) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/v1/districts", JSON.stringify(district), { headers: headers });
  }
  deleteDistrict(uid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/v1/districts/" + uid, { headers: headers });
  }

  evaluateDistrict(url, datasetuid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/districts/" + url + "/" + datasetuid, { headers: headers })
      .map(res => res.json());
  }

  checkConnection(uid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/districts/openmrs/" + uid, { headers: headers })
      .map(res => res.json());
  }



}

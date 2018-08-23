/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';

/** 
* @author Damasceno Lopes
*/
@Injectable()
export class DistrictsService {
  public url: string = myGlobals.API_districts;

   
  constructor(public http: Http) {
  }

  /**
   * Returns all Districts
   */
  getDistricts() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns all Districts wich belongs to a specific User 
   * with given name and lifecycle status
   * 
   * @param page the page number
   * @param size the size of page
   * @param name the district name
   * @param canceled the canceled status
   */
  getDistrictsFiltered(page, size, name, canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/getf?page=" + page + "&size=" + size + "&name=" + name + "&canceled=" + canceled, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns all Districts with given name and lifecycle status
   * 
   * @param page the page number
   * @param size the size of page
   * @param name the district name
   * @param canceled the canceled status
   */
  getDistrictsAll(page, size, name, canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&name=" + name + "&canceled=" + canceled, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns date of last backup received by District
   */
  getDistrictsReceiveInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receiveinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns date of last backup restored by District
   */
  getDistrictsRestoreInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'restoreinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the last sync by District
   */
  getDistrictsSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of backup received on previous month by District
   */
  getReceivedPM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedpreviousmonth', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of backup received on this month by District
   */
  getReceivedTM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedthismonth', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of backup received on the last 12 months
   */
  getReceivedLast() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedlastmonths', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns District with the given uuid
   * 
   * @param uuid the District uuid
   */
  getDistrictByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getDistrictUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new District
   * 
   * @param district the District
   */
  addDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(district), { headers: headers });
  }

  /**
   * Update the District
   * 
   * @param district the District
   */
  updateDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(district), { headers: headers });
  }
  /**
   * Delete the District with the given uuid
   * 
   * @param uuid the District uuid
   */
  deleteDistrict(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getDistrictUrl(uuid), { headers: headers });
  }

  /**
   * Performs the database evaluation
   * 
   * @param url the OpenMRS instance url
   * @param datasetuuid the OpenMRS SQL dataset uuid
   */
  evaluate(url, datasetuuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/" + url + "/" + datasetuuid, { headers: headers })
      .map(res => res.json());
  }

  private getDistrictUrl(uuid) {
    return this.url + "/" + uuid;
  }
}

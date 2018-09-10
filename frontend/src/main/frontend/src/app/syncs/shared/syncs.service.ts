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
export class SyncsService {
  public url: string = myGlobals.API_syncs;
  constructor(public http: Http) {
  }

  /**
   * Return Sync with the given uuid
   * 
   * @param uuid the Sync uuid
   */
  getSync(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl(uuid), { headers: headers })
      .map(res => res.json());
  }
  
  /**
   * Returns Syncs paginated with the given District and Sync date range
   * 
   * @param page the page number
   * @param size the size of page
   * @param district_id the District id
   * @param server_id the Server id
   * @param from the Sync date from
   * @param until the Sync Date until
   */
  getSyncs(page, size, district_id,server_id, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "?search=district:" + district_id + ",server~" + server_id + ",starttime>" + from + ",starttime<" + until + ",user!user&page=" + page+"&size="+size, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Reurns the number of all Syncs in progress
   */
  getSyncsInProgress() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"inprogress", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Reurns the number of all Syncs in progress on Districts of specific User
   */
  getSyncsInProgressByUser() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"inprogressuser", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Sync
   * 
   * @param sync the Sync
   */
  addSync(sync) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(sync), { headers: headers });
  }

  /**
   * Update Sync
   * 
   * @param sync the Sync
   */
  updateSync(sync) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(sync), { headers: headers });
  }

  /**
   * Deletes the Sync
   * 
   * @param sync_id the Sync id
   */
  deleteSync(sync_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getSyncUrl(sync_id), { headers: headers });
  }
  public getSyncUrl(uuid) {
    return this.url + "/" + uuid;
  }  

}
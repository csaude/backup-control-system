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
   * Return the Sync with the given Sync id
   * 
   * @param sync_id the Sync id
   */
  getSyncById(sync_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl3(sync_id), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated with the given District
   * 
   * @param page the page number
   * @param size the size of page
   * @param district_id the District id
   */
  getSyncsByDistrict(page, size, district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl4() + "get?page=" + page + "&size=" + size + "&district=" + district_id, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated with the given Server
   * 
   * @param page the page number
   * @param size the size of page
   * @param server_id the Server server id
   */
  getSyncsByServer(page, size, server_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl9() + "get?page=" + page + "&size=" + size + "&server=" + server_id, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated of Districts of specific user
   * 
   * @param page the page number
   * @param size the size of page
   */
  getSyncsByUser(page, size) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl6() + "get?page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated with the given District and Sync date range
   * 
   * @param page the page number
   * @param size the size of page
   * @param district_id the District id
   * @param from the Sync date from
   * @param until the Sync Date until
   */
  getSyncsByDistrictDate(page, size, district_id, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl5() + "get?page=" + page + "&size=" + size + "&district=" + district_id + "&from=" + from + "&until=" + until, { headers: headers })
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
   * Returns Syncs paginated with the given Sync date range
   * 
   * @param page the page number
   * @param size the size of page
   * @param from the Sync date from
   * @param until the Sync date until
   */
  getSyncsByDate(page, size, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"date/" + "get?page=" + page + "&size=" + size + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated with the given Server and Sync date range
   * 
   * @param page the page number
   * @param size the size of page
   * @param server_id the Server id
   * @param from the Sync date from
   * @param until the Sync date until
   */
  getSyncsByServerDate(page, size, server_id, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl10() + "get?page=" + page + "&size=" + size + "&server=" + server_id + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Syncs paginated that occured on Districts of specific
   * User with the given Sync date range
   * 
   * @param page the page number
   * @param size the size of page
   * @param from the Sync date from
   * @param until the Sync date until
   */
  getSyncsByUserDate(page, size, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl7() + "get?page=" + page + "&size=" + size + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns all Syncs paginated
   * 
   * @param page the page number
   * @param size the size of page
   */
  getAllSyncs(page, size) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSyncUrl8() + "get?page=" + page + "&size=" + size, { headers: headers })
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
  public getSyncUrl(sync_id) {
    return this.url + "/" + sync_id;
  }
  public getSyncUrl3(sync_id) {
    return this.url + "s/" + sync_id;
  }
  public getSyncUrl4() {
    return this.url + "district/";
  }

  public getSyncUrl9() {
    return this.url + "server/";
  }

  public getSyncUrl6() {
    return this.url + "user/";
  }
  public getSyncUrl8() {
    return this.url + "all/";
  }
  public getSyncUrl5() {
    return this.url + "districtdate/";
  }

  public getSyncUrl10() {
    return this.url + "serverdate/";
  }
  public getSyncUrl7() {
    return this.url + "userdate/";
  }

}
/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from 'globals';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class ResourcesService {

  public url: string = myGlobals.API;

  constructor(public http: Http) {
  }

 //-------------------------------------------------
  //DATA FOR DASHBOARD
  //-------------------------------------------------
  /**
   * Returns date of last backup received by District
   */
  findOneDistrictByUuidsReceiveInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/districtsreceiveinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns date of last backup restored by District
   */
  findOneDistrictByUuidsRestoreInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/districtsrestoreinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the last sync by District
   */
  findOneDistrictByUuidsSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/districtssyncinfo', { headers: headers })
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
    return this.http.get(this.url + '/districtsreceivedpreviousmonth', { headers: headers })
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
    return this.http.get(this.url + '/districtsreceivedthismonth', { headers: headers })
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
    return this.http.get(this.url + '/districtsreceivedlastmonths', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the number of Backups Sends not received
   */
  findOneSendByUuidsNotReceivedNum() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/sendsnotreceived", { headers: headers })
      .map(res => res.json());
  }

 /**
   * Reurns the number of all Syncs in progress
   */
  findSyncsInProgress() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/syncsinprogress", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Reurns the number of all Syncs in progress on Districts of specific User
   */
  findSyncsInProgressByUser() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/syncsinprogressuser", { headers: headers })
      .map(res => res.json());
  }


   /*
  *Return last sync by Server
  */
 findOneServerByUuidsSyncInfo() {
  var headers: any = new Headers();
  var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
  headers.append('Content-Type', 'application/json');
  return this.http.get(this.url + '/serverssyncinfo', { headers: headers })
    .map(res => res.json());
}

/**
   * Returns number of Syncs that occured by Server on previous week
   */
  findSyncsPW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/serverssyncspreviousweek', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of Syncs that occured by Server on this week
   */
  findSyncsTW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/serverssyncsthisweek', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number Syncs remaining items by Server on previous week
   */
  findSyncsItemsPW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/serverssyncsitemspreviousweek', { headers: headers })
      .map(res => res.json());
  }

  /**
     * Returns number Syncs remaining items by Server on this week
     */
  findSyncsItemsTW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/serverssyncsitemsthisweek', { headers: headers })
      .map(res => res.json());
  }



}

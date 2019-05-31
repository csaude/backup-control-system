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
  //DISTRICT INFO
  //-------------------------------------------------
  /**
   * Returns date of last backup received by District
   */
  findDistrictsInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/districtsInformation', { headers: headers })
      .map(res => res.json());
  }

 //-------------------------------------------------
  //DATA FOR DASHBOARD
  //-------------------------------------------------
  /**
   * Returns date of last backup received by District
   */
  findDistrictsReceiveInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/districtsreceiveinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns date of last backup restored by District
   */
  findDistrictsRestoreInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/districtsrestoreinfo', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the last sync by District
   */
  findDistrictsSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/districtssyncinfo', { headers: headers })
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
    return this.http.get(this.url + '/v1/districtsreceivedpreviousmonth', { headers: headers })
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
    return this.http.get(this.url + '/v1/districtsreceivedthismonth', { headers: headers })
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
    return this.http.get(this.url + '/v1/districtsreceivedlastmonths', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the number of Backups Sends not received
   */
  findSendsNotReceivedNum() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/sendsnotreceived", { headers: headers })
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
    return this.http.get(this.url + "/v1/syncsinprogress", { headers: headers })
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
    return this.http.get(this.url + "/v1/syncsinprogressuser", { headers: headers })
      .map(res => res.json());
  }


   /*
  *Return last sync by Server
  */
 findServersInfo() {
  var headers: any = new Headers();
  var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
  var user = JSON.parse(window.sessionStorage.getItem('user'));
  headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
  headers.append('Content-Type', 'application/json');
  return this.http.get(this.url + '/v1/serversInformation', { headers: headers })
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
    return this.http.get(this.url + '/v1/serverssyncspreviousweek', { headers: headers })
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
    return this.http.get(this.url + '/v1/serverssyncsthisweek', { headers: headers })
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
    return this.http.get(this.url + '/v1/serverssyncsitemspreviousweek', { headers: headers })
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
    return this.http.get(this.url + '/v1/serverssyncsitemsthisweek', { headers: headers })
      .map(res => res.json());
  }



}

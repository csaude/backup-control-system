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
export class ReceivesService {
  public url: string = myGlobals.API_receives;

   
  constructor(public http: Http) {
  }

  /**
     * Returns all Sends 
     * 
     * @param page the page number
     * @param size the size of page
     * @param restored the restored status
     * @param canceled the canceled status
     * @param from the Backup date from
     * @param until the Backup date until
     * @param district the Send District id
     */
    getAllReceivesPaginated(page, size, canceled, from, until, district) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + "?search=canceled~" + canceled + ",backupdate>" + from + ",backupdate<" + until + ",district:" + district + "&page=" + page + "&size=" + size, { headers: headers })
        .map(res => res.json());
    }

  /**
   * Return Receive with the given Receive uuid
   * 
   * @param uuid the Receive uuid
   */
  getReceive(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl(uuid), { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Receive by Send uuid
   * 
   * @param uuid the Send uuid
   */
  getReceiveBySendUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl3(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Receive
   * 
   * @param receive the Receive 
   */
  addReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(receive), { headers: headers });
  }

  /**
   * Update the Receive
   * 
   * @param receive the Receive
   */
  updateReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(receive), { headers: headers });
  }

  /**
   * Deletes the Receive with the given uuid
   * 
   * @param uuid 
   */
  deleteReceive(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getReceiveUrl(uuid), { headers: headers });
  }
  public getReceiveUrl(receive_id) {
    return this.url + "/" + receive_id;
  }
 public getReceiveUrl3(send_id) {
    return this.url + "send/" + send_id;
  }
}
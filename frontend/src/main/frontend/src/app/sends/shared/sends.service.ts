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
export class SendsService {
  public url: string = myGlobals.API_sends;
  constructor(public http: Http) {
  }
  /**
   * Returns the number of Backups Sends not received
   */
  getSendsNotReceivedNum() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "notreceived", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return Send with thw given uuid
   * 
   * @param uuid the uuid
   */
  getSend(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
     * Returns all Sends
     * 
     * @param page the page number
     * @param size the size of page
     * @param received the received status
     * @param canceled the canceled status
     * @param from the Backup date from
     * @param until the Backup date until
     * @param district the Send District id
     */
  getSendsPaginated(page, size, received, canceled, from, until, district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "?search=received~" + received + ",canceled~" + canceled + ",backupdate>" + from + ",backupdate<" + until + ",district:" + district + ",user!user&page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
     * Returns all Receives 
     * 
     * @param page the page number
     * @param size the size of page
     * @param received the received status
     * @param canceled the canceled status
     * @param from the Backup date from
     * @param until the Backup date until
     * @param district the Send District id
     */
  getAllSendsPaginated(page, size, received, canceled, from, until, district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "?search=received~" + received + ",canceled~" + canceled + ",backupdate>" + from + ",backupdate<" + until + ",district:" + district + "&page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Send
   * 
   * @param send the Send
   */
  addSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(send), { headers: headers });
  }

  /**
   * Update the Send
   * 
   * @param send the Send
   */
  updateSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(send), { headers: headers });
  }

  /**
   * Delete the Send with the given Send uuid
   * 
   * @param uuid 
   */
  deleteSend(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getSendUrl(uuid), { headers: headers });
  }
  public getSendUrl(send_id) {
    return this.url + "/" + send_id;
  }
  public getSendUrl3(send_id) {
    return this.url + "s/" + send_id;
  }

}
/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class SendsService {

  public url: string = myGlobals.API;
  
  constructor(public http: Http) {
  }
  
  /**
   * Return Send with thw given uuid
   * 
   * @param uuid the uuid
   */
  findOneSendByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/send/"+uuid, { headers: headers })
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
  findSends(page, size, received, canceled, from, until, district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/sends?filterCriteria=received=eq:" + received + ",canceled=eq:" + canceled + ",backupdate=gte:" + from + ",backupdate=lte:" + until + ",district=eq:" + district + ",user!user&pageNumber=" + page + "&pageSize=" + size+"&sortingCriteria=-backupdate", { headers: headers })
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
  findAllSends(page, size, received, canceled, from, until, district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/sends?filterCriteria=received=eq:" + received + ",canceled=eq:" + canceled + ",backupdate=gte:" + from + ",backupdate=lte:" + until + ",district=eq:" + district + "&pageNumber=" + page + "&pageSize=" + size+"&sortingCriteria=-backupdate", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Send
   * 
   * @param send the Send
   */
  createSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/send", JSON.stringify(send), { headers: headers });
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
    return this.http.put(this.url + "/send", JSON.stringify(send), { headers: headers });
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
    return this.http.delete(this.url + "/send/"+uuid, { headers: headers });
  }
}
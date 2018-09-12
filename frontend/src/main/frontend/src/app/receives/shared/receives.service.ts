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
export class ReceivesService {
  public url: string = myGlobals.API;

   
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
    findAllReceives(page, size, canceled, from, until, district) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + "/receives?filterCriteria=canceled=eq:" + canceled + ",backupdate=gte:" + from + ",backupdate=lte:" + until + ",district=eq:" + district + "&pageNumber=" + page + "&pageSize=" + size+"&sortingCriteria=-send.backupdate", { headers: headers })
        .map(res => res.json());
    }

  /**
   * Return Receive with the given Receive uuid
   * 
   * @param uuid the Receive uuid
   */
  findOneReceiveByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/receive/"+uuid, { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Receive by Send uuid
   * 
   * @param uuid the Send uuid
   */
  findOneReceiveBySendUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/receive/send/"+uuid, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Receive
   * 
   * @param receive the Receive 
   */
  createReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/receive", JSON.stringify(receive), { headers: headers });
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
    return this.http.put(this.url + "/receive", JSON.stringify(receive), { headers: headers });
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
    return this.http.delete(this.url + "/receive/"+uuid, { headers: headers });
  }
  
}
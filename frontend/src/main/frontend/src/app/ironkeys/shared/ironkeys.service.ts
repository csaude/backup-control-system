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
export class IronkeysService {
  public url: string = myGlobals.API_ironkeys;

   
  constructor(public http: Http) {
  }

  /**
   * Return all Ironkeys
   */
  getIronkeys() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return all Ironkeys with the given serial, version, status or capacity
   * 
   * @param page the page number
   * @param size the size of page
   * @param serial the Ironkey serial number
   * @param version the Ironkey version number
   * @param status the Ironkey status
   * @param capacity the Ironkey capacity
   */
  getIronkeysPaginated(page, size, serial, version, status, capacity) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=serial:" + serial + ",version:" + version + ",status~" + status + ",size~" + capacity, { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Ironkey with the given uuid
   * 
   * @param uuid the Ironkey uuid
   */
  getIronkeyByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getIronkeyUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Ironkey
   * 
   * @param ironkey the Ironkey
   */
  addIronkey(ironkey) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(ironkey), { headers: headers });
  }

  /**
   * Update the Ironkey
   * 
   * @param ironkey the Ironkey
   */
  updateIronkey(ironkey) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(ironkey), { headers: headers });
  }

  /**
   * Delete the Ironkey with the given uuid
   * 
   * @param uuid the Ironkey uuid
   */
  deleteIronkey(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getIronkeyUrl(uuid), { headers: headers });
  }
  public getIronkeyUrl(ironkey_id) {
    return this.url + "/" + ironkey_id;
  }
}
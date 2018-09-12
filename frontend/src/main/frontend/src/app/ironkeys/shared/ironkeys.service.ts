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
export class IronkeysService {
  public url: string = myGlobals.API;

   
  constructor(public http: Http) {
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
  findIronkeys(page, size, serial, version, status, capacity) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/ironkeys?filterCriteria=serial=like:" + serial + ",version=like:" + version + ",status=eq:" + status + ",size=eq:" + capacity+"&sortingCriteria=+name&pageNumber=" + page + "&pageSize=" + size , { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Ironkey with the given uuid
   * 
   * @param uuid the Ironkey uuid
   */
  findOneIronkeyByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/ironkey/" + uuid, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Ironkey
   * 
   * @param ironkey the Ironkey
   */
  createIronkey(ironkey) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/ironkey", JSON.stringify(ironkey), { headers: headers });
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
    return this.http.put(this.url + "/ironkey", JSON.stringify(ironkey), { headers: headers });
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
    return this.http.delete(this.url + "/ironkey/" + uuid, { headers: headers });
  }
  
}
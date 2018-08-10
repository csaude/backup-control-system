/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
@Injectable()
export class IronkeysService {
  public url: string = myGlobals.API_ironkeys;
  constructor(public http: Http) {
  }
  getIronkeys() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  getIronkeysPaginated(page, size, serial, version, status,capacity) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=serial:" + serial + ",version:" + version + ",status~" + status+ ",size~" + capacity, { headers: headers })
      .map(res => res.json());
  }
  getIronkeyByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getIronkeyUrl(uuid), { headers: headers })
      .map(res => res.json());
  }
  addIronkey(ironkey) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(ironkey), { headers: headers });
  }
  updateIronkey(ironkey) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(ironkey), { headers: headers });
  }
  deleteIronkey(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getIronkeyUrl(uuid), { headers: headers });
  }
  public getIronkeyUrl(ironkey_id) {
    return this.url + "/" + ironkey_id;
  }
}
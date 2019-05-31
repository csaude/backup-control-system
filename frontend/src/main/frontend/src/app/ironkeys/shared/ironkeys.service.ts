import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs/Subject';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
@Injectable()
export class IronkeysService {

  public url: string = myGlobals.API;
  invokeEvent: Subject<any> = new Subject();

  constructor(public http: Http) {

  }

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }

  findIronkeys(page, size, serial, version, status, capacity, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/ironkeys?fields=" + fields + "&filter=serial:like:" + serial + ",version:like:" + version + ",status:eq:" + status + ",size:eq:" + capacity + "&order=+serial&page=" + page + "&pageSize=" + size, { headers: headers })
      .map(res => res.json());
  }

  findOneIronkeyByUuid(uuid, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/ironkeys/" + uuid + "?fields=" + fields, { headers: headers })
      .map(res => res.json());
  }

  createIronkey(ironkey) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/v1/ironkeys", JSON.stringify(ironkey), { headers: headers });
  }

  updateIronkey(ironkey) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/v1/ironkeys", JSON.stringify(ironkey), { headers: headers });
  }

  deleteIronkey(uid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/v1/ironkeys/" + uid, { headers: headers });
  }

}
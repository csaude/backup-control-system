import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs/Subject';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
@Injectable()
export class TransportersService {
  
  public url: string = myGlobals.API;
  invokeEvent: Subject<any> = new Subject();

  constructor(public http: Http) {
  }

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }

  findTransporters(page: any, pageSize: any, name: string, role: string, canceled: boolean, fields: string) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/transporters?fields=" + fields + "&filter=name:like:" + name + ",role:eq:" + role + ",canceled:eq:" + canceled + "&page=" + page + "&pageSize=" + pageSize + "&order=+name", { headers: headers })
      .map(res => res.json());
  }

  findOneTransporterByUid(uid: string, fields: string) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/transporters/" + uid + "?fields=" + fields, { headers: headers })
      .map(res => res.json());
  }

  createTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/v1/transporters", JSON.stringify(transporter), { headers: headers });
  }

  updateTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/v1/transporters", JSON.stringify(transporter), { headers: headers });
  }

  deleteTransporter(uid: string) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/v1/transporters/" + uid, { headers: headers });
  }

}
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs/Subject';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class ServersService {
  public url: string = myGlobals.API;
  invokeEvent: Subject<any> = new Subject();
  constructor(public http: Http) {
  }

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }

  findServers(page, size, district, name, canceled, type, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/servers?fields=" + fields + "&filter=district:eq:" + district + ",name:like:" + name + ",canceled:eq:" + canceled + ",type:eq:" + type + ",user!user&page=" + page + "&pageSize=" + size + "&order=+district.name,+name", { headers: headers })
      .map(res => res.json());
  }

  findOneServerByUuid(uuid, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/servers/" + uuid + "?fields=" + fields, { headers: headers })
      .map(res => res.json());
  }

  createServer(server) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/v1/servers", JSON.stringify(server), { headers: headers });
  }

  updateServer(server) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/v1/servers", JSON.stringify(server), { headers: headers });
  }

  deleteServer(uuid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/v1/servers/" + uuid, { headers: headers });
  }


}
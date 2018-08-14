/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';

@Injectable()
export class DistrictsService {
  public url: string = myGlobals.API_districts;
  constructor(public http: Http) {
  }

  getDistricts() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  
  getDistrictsFiltered(page,size,name,canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"/getf?page="+page+"&size="+size+"&name="+name+"&canceled="+canceled, { headers: headers })
      .map(res => res.json());
  }

  getDistrictsAll(page,size,name,canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"/get?page="+page+"&size="+size+"&name="+name+"&canceled="+canceled, { headers: headers })
      .map(res => res.json());
  }

  getDistrictsReceiveInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receiveinfo', { headers: headers })
      .map(res => res.json());
  }

  getDistrictsRestoreInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'restoreinfo', { headers: headers })
      .map(res => res.json());
  }

  getDistrictsSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncinfo', { headers: headers })
      .map(res => res.json());
  }

  getReceivedPM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedpreviousmonth', { headers: headers })
      .map(res => res.json());
  }

  getReceivedTM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedthismonth', { headers: headers })
      .map(res => res.json());
  }

  getReceivedLast() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'receivedlastmonths', { headers: headers })
      .map(res => res.json());
  }

  getSendPM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'sendpreviousmonth', { headers: headers })
      .map(res => res.json());
  }

  getSendTM() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'sendthismonth', { headers: headers })
      .map(res => res.json());
  }

  getDistrictByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getDistrictUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  addDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(district), { headers: headers });
  }

  updateDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(district), { headers: headers });
  }

  deleteDistrict(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getDistrictUrl(uuid), { headers: headers });
  }

  evaluate(url, datasetuuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/" + url + "/" + datasetuuid, { headers: headers })
      .map(res => res.json());
  }
  
  public getDistrictUrl(uuid) {
    return this.url + "/" + uuid;
  }

}

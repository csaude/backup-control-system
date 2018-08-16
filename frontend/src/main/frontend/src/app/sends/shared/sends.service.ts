/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
@Injectable()
export class SendsService {
  public url: string = myGlobals.API_sends;
  constructor(public http: Http) {
  }
  getSends() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  getSendsNotReceivedNum() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"notreceived", { headers: headers })
      .map(res => res.json());
  }
  getSend(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl(send_id), { headers: headers })
      .map(res => res.json());
  }
  getSendById(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl3(send_id), { headers: headers })
      .map(res => res.json());
  }
  getSendsByDistrict(page,size,district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl4()+"get?page="+page+"&size="+size+"&district="+district_id, { headers: headers })
      .map(res  => res.json());
    }

    getSendsByUser(page,size) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getSendUrl6()+"get?page="+page+"&size="+size, { headers: headers })
        .map(res  => res.json());
      }
      getAllSendsNotReceived(page,size) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getSendUrl8()+"get?page="+page+"&size="+size, { headers: headers })
          .map(res  => res.json());
        }
    getSendsByDistrictDate(page,size,district_id,from,until) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getSendUrl5()+"get?page="+page+"&size="+size+"&district="+district_id+"&from="+from+"&until="+until, { headers: headers })
        .map(res  => res.json());
      }
      getSendsByUserDate(page,size,from,until) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getSendUrl7()+"get?page="+page+"&size="+size+"&from="+from+"&until="+until, { headers: headers })
          .map(res  => res.json());
        }
  addSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(send), { headers: headers });
  }
  updateSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(send), { headers: headers });
  }
  deleteSend(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getSendUrl(send_id), { headers: headers });
  }
  public getSendUrl(send_id) {
    return this.url + "/" + send_id;
  }
  public getSendUrl3(send_id) {
    return this.url + "s/" + send_id;
  }
  public getSendUrl4() {
    return this.url + "district/" ;
  }
  public getSendUrl6() {
    return this.url + "user/" ;
  }
  public getSendUrl8() {
    return this.url + "all/" ;
  }
  public getSendUrl5() {
    return this.url + "districtdate/" ;
  }
  public getSendUrl7() {
    return this.url + "userdate/" ;
  }
  
}
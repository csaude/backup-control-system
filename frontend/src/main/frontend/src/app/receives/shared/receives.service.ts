/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
@Injectable()
export class ReceivesService {
  public url: string = myGlobals.API_receives;
  constructor(public http: Http) {
  }

  getReceives() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  getReceive(receive_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl(receive_id), { headers: headers })
      .map(res => res.json());
  }
  getReceiveBySendId(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl3(send_id), { headers: headers })
      .map(res => res.json());
  }
  getReceivesByDistrict(page,size,district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl4()+"get?page="+page+"&size="+size+"&district="+district_id, { headers: headers })
      .map(res  => res.json());
    }
    getReceivesByUser(page,size) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getReceiveUrl6()+"get?page="+page+"&size="+size, { headers: headers })
        .map(res  => res.json());
      }
      getAllReceived(page,size) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getReceiveUrl8()+"get?page="+page+"&size="+size, { headers: headers })
          .map(res  => res.json());
        }
      
      getReceivesByUserDate(page,size,from,until) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getReceiveUrl7()+"get?page="+page+"&size="+size+"&from="+from+"&until="+until, { headers: headers })
          .map(res  => res.json());
        }

        getReceivesByDate(page,size,from,until) {
          var headers: any = new Headers();
          var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
          var user = JSON.parse(window.sessionStorage.getItem('user'));
          headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
          headers.append('Content-Type', 'application/json');
          return this.http.get(this.getReceiveUrl9()+"get?page="+page+"&size="+size+"&from="+from+"&until="+until, { headers: headers })
            .map(res  => res.json());
          }

    getReceivesByDistrictDate(page,size,district_id,from,until) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getReceiveUrl5()+"get?page="+page+"&size="+size+"&district="+district_id+"&from="+from+"&until="+until, { headers: headers })
        .map(res  => res.json());
      }
  addReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(receive), { headers: headers });
  }
  updateReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(receive), { headers: headers });
  }
  deleteReceive(receive_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getReceiveUrl(receive_id), { headers: headers });
  }
  public getReceiveUrl(receive_id) {
    return this.url + "/" + receive_id;
  }
  public getReceiveUrl4() {
    return this.url + "district/" ;
  }
  public getReceiveUrl3(send_id) {
    return this.url + "send/" + send_id;
  }
  public getReceiveUrl2(receive_id, creatorid, updaterid) {
    return this.url + "/" + receive_id + "/" + creatorid + "/" + updaterid;
  }
  public getReceiveUrl6() {
    return this.url + "user/" ;
  }
  public getReceiveUrl7() {
    return this.url + "userdate/" ;
  }
  public getReceiveUrl5() {
    return this.url + "districtdate/" ;
  }
  public getReceiveUrl9() {
    return this.url + "date/" ;
  }
  public getReceiveUrl8() {
    return this.url + "all/" ;
  }
}
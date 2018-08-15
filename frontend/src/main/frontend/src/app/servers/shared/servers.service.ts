/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
@Injectable()
export class ServersService {
  public url: string = myGlobals.API_servers;
  constructor(public http: Http) {
  }
  getServers() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }

  getServersByUser() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"user", { headers: headers })
      .map(res => res.json());
  }

  getServersSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncinfo', { headers: headers })
      .map(res => res.json());
  }


  getServersPaginated(page, size, district,name,canceled,type) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=district~"+district+",name:" + name+ ",canceled!" + canceled+ ",type!" + type, { headers: headers })
      .map(res => res.json());
  }
  getServerByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getServerUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  getServersByDistrict(district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+'district/'+district_id, { headers: headers })
      .map(res  => res.json());
    }

    getSyncsPW() {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
      var user = JSON.parse(window.localStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + 'syncspreviousweek', { headers: headers })
        .map(res => res.json());
    }

    getSyncsTW() {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
      var user = JSON.parse(window.localStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + 'syncsthisweek', { headers: headers })
        .map(res => res.json());
    }

    getSyncsItemsPW() {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
      var user = JSON.parse(window.localStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + 'syncsitemspreviousweek', { headers: headers })
        .map(res => res.json());
    }

    getSyncsItemsTW() {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
      var user = JSON.parse(window.localStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.url + 'syncsitemsthisweek', { headers: headers })
        .map(res => res.json());
    }

  addServer(server) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(server), { headers: headers });
  }
  updateServer(server) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(server), { headers: headers });
  }
  deleteServer(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getServerUrl(uuid), { headers: headers });
  }
  public getServerUrl(server_id) {
    return this.url + "/" + server_id;
  }
}
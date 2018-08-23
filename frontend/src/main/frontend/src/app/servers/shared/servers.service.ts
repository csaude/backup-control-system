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
export class ServersService {
  public url: string = myGlobals.API_servers;


  constructor(public http: Http) {
  }

  /*
  *Returns all Servers
  */
  getServers() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }

  /*
  *Return all Servers of Districts of specific User
  */
  getServersByUser() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "user", { headers: headers })
      .map(res => res.json());
  }

  /*
  *Return last sync by Server
  */
  getServersSyncInfo() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncinfo', { headers: headers })
      .map(res => res.json());
  }
  /**
   * Returns all Servers paginated with the given district, name or lifecycle status
   * 
   * @param page the page number
   * @param size the size of
   * @param district the district 
   * @param name the Server name
   * @param canceled the lifecycle status (canceled or not canceled)
   * @param type the Server type
   */
  getServersPaginated(page, size, district, name, canceled, type) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=district~" + district + ",name:" + name + ",canceled!" + canceled + ",type!" + type, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return the Server with the given uuid
   * 
   * @param uuid the Server uuid
   */
  getServerByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getServerUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Servers with thw given District
   * 
   * @param district_id the District id
   */
  getServersByDistrict(district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'district/' + district_id, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of Syncs that occured by Server on previous week
   */
  getSyncsPW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncspreviousweek', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number of Syncs that occured by Server on this week
   */
  getSyncsTW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncsthisweek', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns number Syncs remaining items by Server on previous week
   */
  getSyncsItemsPW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncsitemspreviousweek', { headers: headers })
      .map(res => res.json());
  }

  /**
     * Returns number Syncs remaining items by Server on this week
     */
  getSyncsItemsTW() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'syncsitemsthisweek', { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Server
   * 
   * @param server the Server
   */
  addServer(server) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(server), { headers: headers });
  }

  /**
   * Updated the Server
   * 
   * @param server the Server
   */
  updateServer(server) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(server), { headers: headers });
  }

  /**
   * Deletes the Server by uuid
   * 
   * @param uuid the uuid
   */
  deleteServer(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getServerUrl(uuid), { headers: headers });
  }
  public getServerUrl(server_id) {
    return this.url + "/" + server_id;
  }
}
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
export class ServersService {
  public url: string = myGlobals.API;

  constructor(public http: Http) {
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
  findServers(page, size, district, name, canceled, type) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/servers?filterCriteria=district=eq:" + district + ",name=like:" + name + ",canceled=eq:" + canceled + ",type=eq:" + type+",user!user&pageNumber="+page+"&pageSize=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return the Server with the given uuid
   * 
   * @param uuid the Server uuid
   */
  findOneServerByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/server/"+uuid, { headers: headers })
      .map(res => res.json());
  }
  
  /**
   * Add new Server
   * 
   * @param server the Server
   */
  createServer(server) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/server", JSON.stringify(server), { headers: headers });
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
    return this.http.put(this.url + "/server", JSON.stringify(server), { headers: headers });
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
    return this.http.delete(this.url + "/server/"+uuid, { headers: headers });
  }
  
 
}
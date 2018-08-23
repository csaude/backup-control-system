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
export class TransportersService {
  public url: string = myGlobals.API_transporters;
  
     
  constructor(public http: Http) {
  }

  /**
   * Returns all Transporters
   */
  getTransporters() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns all Transporters with the given name, role or lifecicle status
   * 
   * @param page the page number
   * @param size the size of page
   * @param name the Transporter name
   * @param role the Transporter role
   * @param canceled the lifecycle status
   */
  getTransportersPaginated(page, size, name, role, canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=name:" + name + ",role~" + role + ",canceled~" + canceled, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the Transporter with the given uuid
   * 
   * @param uuid Transporter uuid
   */
  getTransporterByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getTransporterUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Tranpsorter
   * 
   * @param transporter the Transporter
   */
  addTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(transporter), { headers: headers });
  }

  /**
   * Update the Transporter
   * 
   * @param transporter the Transporter
   */
  updateTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(transporter), { headers: headers });
  }

  /**
   * Delete the Transporter with the given uuid
   * 
   * @param uuid The Transporter uuid
   */
  deleteTransporter(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getTransporterUrl(uuid), { headers: headers });
  }
  public getTransporterUrl(uuid) {
    return this.url + "/" + uuid;
  }
}
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
export class DistrictsService {

  public url: string = myGlobals.API;

  constructor(public http: Http) {
  }

  /**
   * Returns District with the given uuid
   * 
   * @param uuid the District uuid
   */
  findOneDistrictByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"/district/"+uuid, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns all Districts with the given name and lifecycle status
   * 
   * @param page the page number
   * @param size the size of page
   * @param name the district name
   * @param canceled the canceled status
   */
  findDistricts(page, size, name, canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/districts?search=name:"+name+",canceled~" + canceled+",user!user&page=" + page + "&size=" + size , { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new District
   * 
   * @param district the District
   */
  createDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url+"/district", JSON.stringify(district), { headers: headers });
  }

  /**
   * Update the District
   * 
   * @param district the District
   */
  updateDistrict(district) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url+"/district", JSON.stringify(district), { headers: headers });
  }
  /**
   * Delete the District with the given uuid
   * 
   * @param uuid the District uuid
   */
  deleteDistrict(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url+"/district/"+uuid, { headers: headers });
  }

  /**
   * Performs the database evaluation
   * 
   * @param url the OpenMRS instance url
   * @param datasetuuid the OpenMRS SQL dataset uuid
   */
  evaluateDistrict(url, datasetuuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"/district/"+url+"/"+ datasetuuid, { headers: headers })
      .map(res => res.json());
  }

  

}

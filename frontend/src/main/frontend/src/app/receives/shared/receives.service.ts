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
export class ReceivesService {
  public url: string = myGlobals.API_receives;

   
  constructor(public http: Http) {
  }
  /**eturns all Receives
   * R
   */
  getReceives() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Receive with the given Receive id
   * 
   * @param receive_id the Receive id
   */
  getReceive(receive_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl(receive_id), { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Receive by Send id
   * 
   * @param send_id the Send id
   */
  getReceiveBySendId(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl3(send_id), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Receives with the given District id
   * 
   * @param page the page number
   * @param size the size of page
   * @param district_id the District id
   */
  getReceivesByDistrict(page, size, district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl4() + "get?page=" + page + "&size=" + size + "&district=" + district_id, { headers: headers })
      .map(res => res.json());
  }

  /**
 * Returns Receives of Districts of Specific User
 * 
 * @param page the page number
 * @param size the size of page
 */
  getReceivesByUser(page, size) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl6() + "get?page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
* Returns all Received
* 
* @param page the page number
* @param size the size of page
*/
  getAllReceived(page, size) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl8() + "get?page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Receives by Districts of specific User in a Specific Send Backup
   * Date Range
   * 
   * @param page the page number
   * @param size the page size
   * @param from the Backup date from
   * @param until the Backup date until
   */
  getReceivesByUserDate(page, size, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl7() + "get?page=" + page + "&size=" + size + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns Receives bySend Backup Date Range
   * 
   * @param page the page number
   * @param size the page size
   * @param from the Backup date from
   * @param until the Backup date until
   */
  getReceivesByDate(page, size, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl9() + "get?page=" + page + "&size=" + size + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }
 /**
   * Returns Receives bySend Backup Date Range and District
   * 
   * @param page the page number
   * @param size the page size
   * @param district_id the District
   * @param from the Backup date from
   * @param until the Backup date until
   */
  getReceivesByDistrictDate(page, size, district_id, from, until) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getReceiveUrl5() + "get?page=" + page + "&size=" + size + "&district=" + district_id + "&from=" + from + "&until=" + until, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Receive
   * 
   * @param receive the Receive 
   */
  addReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(receive), { headers: headers });
  }

  /**
   * Update the Receive
   * 
   * @param receive the Receive
   */
  updateReceive(receive) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(receive), { headers: headers });
  }

  /**
   * Deletes the Receive with the given uuid
   * 
   * @param uuid 
   */
  deleteReceive(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getReceiveUrl(uuid), { headers: headers });
  }
  public getReceiveUrl(receive_id) {
    return this.url + "/" + receive_id;
  }
  public getReceiveUrl4() {
    return this.url + "district/";
  }
  public getReceiveUrl3(send_id) {
    return this.url + "send/" + send_id;
  }
  public getReceiveUrl2(receive_id, creatorid, updaterid) {
    return this.url + "/" + receive_id + "/" + creatorid + "/" + updaterid;
  }
  public getReceiveUrl6() {
    return this.url + "user/";
  }
  public getReceiveUrl7() {
    return this.url + "userdate/";
  }
  public getReceiveUrl5() {
    return this.url + "districtdate/";
  }
  public getReceiveUrl9() {
    return this.url + "date/";
  }
  public getReceiveUrl8() {
    return this.url + "all/";
  }
}
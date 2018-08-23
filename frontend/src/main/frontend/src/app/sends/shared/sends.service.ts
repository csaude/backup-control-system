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
export class SendsService {
  public url: string = myGlobals.API_sends;
  constructor(public http: Http) {
  }
  /**
   * Returns the number of Backups Sends not received
   */
  getSendsNotReceivedNum() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url+"notreceived", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return Send with thw given uuid
   * 
   * @param uuid the uuid
   */
  getSend(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return Sen with the given id
   * 
   * @param send_id the Send id
   */
  getSendById(send_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl3(send_id), { headers: headers })
      .map(res => res.json());
  }
  /**
   * Returns Sends of the given DIstrict
   * 
   * @param page the page number
   * @param size the page size
   * @param district_id the District id
   */
  getSendsByDistrict(page,size,district_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getSendUrl4()+"get?page="+page+"&size="+size+"&district="+district_id, { headers: headers })
      .map(res  => res.json());
    }

    /**
     * Return all Sends of Districts of specific User
     * 
     * @param page the page number
     * @param size the page size
     */
    getSendsByUser(page,size) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getSendUrl6()+"get?page="+page+"&size="+size, { headers: headers })
        .map(res  => res.json());
      }

      /**
     * Return all Sends not received
     * 
     * @param page the page number
     * @param size the page size
     */
      getAllSendsNotReceived(page,size) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getSendUrl8()+"get?page="+page+"&size="+size, { headers: headers })
          .map(res  => res.json());
        }

        /**
         * Returns all Sends with the given District and date range
         * 
         * @param page the page number
         * @param size the size of page
         * @param district_id the District id
         * @param from the Backup date from
         * @param until the Backup date until
         */
    getSendsByDistrictDate(page,size,district_id,from,until) {
      var headers: any = new Headers();
      var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
      var user = JSON.parse(window.sessionStorage.getItem('user'));
      headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
      headers.append('Content-Type', 'application/json');
      return this.http.get(this.getSendUrl5()+"get?page="+page+"&size="+size+"&district="+district_id+"&from="+from+"&until="+until, { headers: headers })
        .map(res  => res.json());
      }

      /**
         * Returns all Sends Districts of a specific User
         * 
         * @param page the page number
         * @param size the size of page
         * @param from the Backup date from
         * @param until the Backup date until
         */
      getSendsByUserDate(page,size,from,until) {
        var headers: any = new Headers();
        var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
        var user = JSON.parse(window.sessionStorage.getItem('user'));
        headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
        headers.append('Content-Type', 'application/json');
        return this.http.get(this.getSendUrl7()+"get?page="+page+"&size="+size+"&from="+from+"&until="+until, { headers: headers })
          .map(res  => res.json());
        }

        /**
         * Add new Send
         * 
         * @param send the Send
         */
  addSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(send), { headers: headers });
  }

  /**
         * Update the Send
         * 
         * @param send the Send
         */
  updateSend(send) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(send), { headers: headers });
  }

  /**
   * Delete the Send with the given Send uuid
   * 
   * @param uuid 
   */
  deleteSend(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getSendUrl(uuid), { headers: headers });
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
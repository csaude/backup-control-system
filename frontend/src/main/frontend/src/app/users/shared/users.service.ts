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
export class UsersService {
  public url: string = myGlobals.API_users;
  
  constructor(public http: Http) {
  }

  /**
   * Returns all Users paginated with the given username and status
   * 
   * @param page the page number
   * @param size the size of page
   * @param username the username
   * @param enabled the User status (enabled/not enabled)
   */
  getUsersPaginated(page, size, username, enabled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=username:" + username + ",enabled~" + enabled, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Return User with the given uuid
   * 
   * @param uuid the uuid
   */
  getUserByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getUserUrl(uuid), { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new User
   * 
   * @param user the User
   */
  addUser(user) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var userLogged = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(userLogged.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(user), { headers: headers });
  }

  /**
   * Update the User on the database, given the occurence of infinite recursion with 
   * self referenced User Entity we should pass the created by and updated by as Ids
   * 
   * @param user the User
   * @param creatorid the created by id
   * @param updaterid the updated by id
   */
  updateUser(user, creatorid, updaterid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var userLogged = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(userLogged.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.getUserUrl2(creatorid, updaterid), JSON.stringify(user), { headers: headers });
  }

  /**
   * Delete a Specific User
   * 
   * @param user_id the User id
   */
  deleteUser(user_id) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getUserUrl(user_id), { headers: headers });
  }
  public getUserUrl(user_id) {
    return this.url + "/" + user_id;
  }
  public getUserUrl2(creatorid, updaterid) {
    return this.url + "/" + creatorid + "/" + updaterid;
  }
}
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
export class EvaluationsService {

  public url: string = myGlobals.API_evaluations;

   
  constructor(public http: Http) {
  }

  /**
   * Returns all Evaluations filtered name and openmrs sql uuid
   * 
   * @param page the page number
   * @param size the page size
   * @param name the Evaluation name
   * @param openmrs_sql_dataset_uuid the openmrs sql sql dataset
   */
  getEvaluationsPaginated(page, size, name, openmrs_sql_dataset_uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "?search=name:" + name + ",openmrs_sql_dataset_uuid~" + openmrs_sql_dataset_uuid+"&page=" + page + "&size=" + size, { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Evaluation by uuid
   * 
   * @param uuid the Evaluation uuid
   */
  getEvaluationByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getEvaluationUrl(uuid), { headers: headers })
      .map(res => res.json());
  }
  
  /**
   * Add new Evaluation to database
   * 
   * @param evaluation the Evaluation
   */
  addEvaluation(evaluation) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(evaluation), { headers: headers });
  }

  /**
   * Update Evaluation
   *  
   * @param evaluation the Evaluation
   */
  updateEvaluation(evaluation) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(evaluation), { headers: headers });
  }

  /**
   * Delete Evaluation with given uuid
   *  
   * @param uuid the Evaluation uuid
   */
  deleteEvaluation(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getEvaluationUrl(uuid), { headers: headers });
  }

  public getEvaluationUrl(uuid) {
    return this.url + "/" + uuid;
  }
}
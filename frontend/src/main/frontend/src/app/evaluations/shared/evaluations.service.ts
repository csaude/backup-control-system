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
export class EvaluationsService {

  public url: string = myGlobals.API;

   
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
  findEvaluations(page, size, name, openmrs_sql_dataset_uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/evaluations?filterCriteria=name=like:" + name + ",openmrs_sql_dataset_uuid=eq:" + openmrs_sql_dataset_uuid+"&sortingCriteria=+name&pageNumber=" + page + "&pageSize=" + size, { headers: headers })
      .map(res => res.json());
  }
  /**
   * Return Evaluation by uuid
   * 
   * @param uuid the Evaluation uuid
   */
  findOneEvaluationByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/evaluation/" + uuid, { headers: headers })
      .map(res => res.json());
  }
  
  /**
   * Add new Evaluation to database
   * 
   * @param evaluation the Evaluation
   */
  createEvaluation(evaluation) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/evaluation", JSON.stringify(evaluation), { headers: headers });
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
    return this.http.put(this.url + "/evaluation", JSON.stringify(evaluation), { headers: headers });
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
    return this.http.delete(this.url + "/evaluation/" + uuid, { headers: headers });
  }

  
}
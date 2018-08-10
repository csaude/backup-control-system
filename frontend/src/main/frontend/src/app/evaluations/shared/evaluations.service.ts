/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';
@Injectable()
export class EvaluationsService {
  public url: string = myGlobals.API_evaluations;
  constructor(public http: Http) {
  }
  getEvaluations() {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url, { headers: headers })
      .map(res => res.json());
  }
  getEvaluationsPaginated(page, size, name, openmrs_sql_dataset_uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/get?page=" + page + "&size=" + size + "&search=name:" + name + ",openmrs_sql_dataset_uuid~" + openmrs_sql_dataset_uuid , { headers: headers })
      .map(res => res.json());
  }
  getEvaluationByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.getEvaluationUrl(uuid), { headers: headers })
      .map(res => res.json());
  }
  addEvaluation(evaluation) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(evaluation), { headers: headers });
  }
  updateEvaluation(evaluation) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url, JSON.stringify(evaluation), { headers: headers });
  }
  deleteEvaluation(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.localStorage.getItem('password'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getEvaluationUrl(uuid), { headers: headers });
  }
  public getEvaluationUrl(uuid) {
    return this.url + "/" + uuid;
  }
}
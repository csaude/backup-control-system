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

  findEvaluations(page, size, name, openmrs_sql_dataset_uid, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/evaluations?fields=" + fields + "&filter=name:like:" + name + ",openmrsSqlUuid:eq:" + openmrs_sql_dataset_uid + "&order=+name&page=" + page + "&pageSize=" + size, { headers: headers })
      .map(res => res.json());
  }

  findOneEvaluationByUuid(uid, fields) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/v1/evaluations/" + uid + "?fields=" + fields, { headers: headers })
      .map(res => res.json());
  }

  createEvaluation(evaluation) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/v1/evaluations", JSON.stringify(evaluation), { headers: headers });
  }

  updateEvaluation(evaluation) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/v1/evaluations", JSON.stringify(evaluation), { headers: headers });
  }

  deleteEvaluation(uid) {
    var headers = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/v1/evaluations/" + uid, { headers: headers });
  }


}
/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as myGlobals from '../../../globals';
@Injectable()
export class PersonsService {
  public url: string = myGlobals.API_persons;
  constructor(public http: Http) { }
  getPersons() {
    return this.http.get(this.url)
      .map(res => res.json());
  }
  getPerson(person_id) {
    return this.http.get(this.getPersonUrl(person_id))
      .map(res => res.json());
  }
  addPerson(person) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url, JSON.stringify(person), { headers: headers });
  }
  updatePerson(person) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.getPersonUrl(person.person_id), JSON.stringify(person), { headers: headers });
  }
  deletePerson(person_id) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.getPersonUrl(person_id), { headers: headers });
  }
  public getPersonUrl(person_id) {
    return this.url + "/" + person_id;
  }
}

import { District } from './../../districts/shared/district';
import { Person } from './../../persons/shared/person';
import { Authority } from './../../authorities/shared/authority';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class User {
  username: string;
  userId: number;
  uid: string;
  personName: string;
  enabled: boolean;
  creatorName: string;
  updaterName: string;
  person: Person = new Person();
  authorities: Authority[] = [];
  districts: District[] = [];
  creatorId: number;
  updaterId: number;
  dateCreated: Date;
  dateUpdated: Date;
  lastLogin: Date;
  password: String;
  locale: string;
  phoneNumber: string;
  notification: boolean;
  fullName: string;

}

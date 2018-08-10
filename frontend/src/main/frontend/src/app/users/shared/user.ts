/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { District } from './../../districts/shared/district';
import { Person } from './../../persons/shared/person';
import { Authority } from './../../authorities/shared/authority';
export class User {
  user_id: number;
  username: string;
  person: Person = new Person();
  authorities: Authority[] = [];
  roles: string;
  enabled: boolean;
  creatorid: number;
  updaterid: number;
  created_by: User;
  password: String;
  districts: District[] = [];
  locale: String;
  notification: boolean;
  creatorname: String;
  date_created: Date;
  last_login: Date;
  uuid: string;
}

/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { District } from './../../districts/shared/district';
import { Person } from './../../persons/shared/person';
import { Authority } from './../../authorities/shared/authority';

/** 
* @author Damasceno Lopes
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

}

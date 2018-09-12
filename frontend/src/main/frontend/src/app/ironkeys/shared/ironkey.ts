/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class Ironkey {
  ironkey_id: number;
  serial: string;
  size: number;
  version: string;
  status: string;
  observation: string;
  date_purchased: Date;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  districtsnumber: number;
  districtsnames: string;
  districtsnamesreport: string;
  uuid: string;
  districts: District[] = []

}

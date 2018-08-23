/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';

/** 
* @author Damasceno Lopes
*/
export class Server {
  server_id: number;
  name: string;
  type: string;
  observation: string;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
  district: District = new District();
  canceled: boolean;
  canceled_reason: string;
  canceled_by: User = new User();
  districtname: String;
}
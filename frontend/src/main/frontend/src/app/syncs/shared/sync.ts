/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Server } from './../../servers/shared/server';
import { User } from './../../users/shared/user';

/** 
* @author Damasceno Lopes
*/
export class Sync {
  sync_id: number;
  server: Server=new Server();
  start_time: Date;
  start_items_to_send: number;
  start_items_to_receive: number;
  end_time: Date;
  end_items_to_send: number;
  end_items_to_receive: number;
  observation: string;
  observation_his: string;
  sync_error: boolean;
  date_created: Date;
  date_updated: Date;
  created_by: User = new User();
  updated_by: User = new User();
  uuid: string;
  canceled: boolean;
  canceled_reason: string;
  state: string;
  duration:string;
  editable: boolean;
  serverfault: boolean;
  laptopfault: boolean;
  powercut: boolean;
  serverreport: String;
  observations: String;

}

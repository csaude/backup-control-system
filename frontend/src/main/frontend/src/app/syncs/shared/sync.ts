/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Server } from './../../servers/shared/server';
import { District } from './../../districts/shared/district';
import { User } from './../../users/shared/user';

/** 
* @author Damasceno Lopes
*/
export class Sync {
  syncId: number;
  startTime: any;
  startItemsToSend: number;
  startItemsToReceive: number;
  endTime: any;
  endItemsToSend: number;
  endItemsToReceive: number;
  observationHis: string;
  observation: string;
  observations: string;
  dateCreated: Date;
  dateUpdated: Date;
  syncError: boolean;
  createdBy: User = new User();
  updatedBy: User = new User();
  uid: string;
  serverFault: boolean;
  laptopFault: boolean;
  powerCut: boolean;
  canceledReason: string;
  canceled: boolean;
  server: Server = new Server();
  district: District = new District();
  serverreport: any;

  syncErrorResolved: boolean;
  serverFaultResolved: boolean;
  laptopFaultResolved: boolean;
  powerCutResolved: boolean;

}

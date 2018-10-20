/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { District } from './../../districts/shared/district';
import { Transporter } from './../../transporters/shared/transporter';
import { User } from './../../users/shared/user';

/** 
* @author Damasceno Lopes
*/
export class Send {
  sendId: number;
  received: boolean;
  backupDate: Date;
  updateFinished: boolean;
  validationFinished: boolean;
  syncFinished: boolean;
  crossDhis2Finished: boolean;
  crossIdartFinished: boolean;
  dateCreated: Date;
  dateUpdated: Date;
  createdBy: User = new User();
  updatedBy: User = new User();
  uid: string;
  ikReceived: boolean;
  dateIkReceived: Date;
  idartBackup: boolean;
  idartBackupDate: Date;
  district: District = new District();
  transporter: Transporter = new Transporter();
  observation: string;
  canceled: boolean;
  canceledReason: string;

  //Receive
  receivername: string;
  receivedate: Date;
  restored: boolean;
  restorername: string;
  date_restored: Date;
  sis_observation: string;
  ik_returned: boolean;
  ik_returneddate: Date;
  ik_returnedto: String;
}

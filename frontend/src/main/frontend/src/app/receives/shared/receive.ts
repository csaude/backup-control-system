/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Send } from './../../sends/shared/send';
import { Transporter } from './../../transporters/shared/transporter';
import { User } from './../../users/shared/user';

/** 
* @author Damasceno Lopes
*/
export class Receive {
  districtname: string;
  Distrito: string;
  Observacao: string;
  obsd: string;
  canceled: boolean;
  restored: boolean;
  receiveId: number;
  receiveDate: Date;
  ikReturned: boolean;
  dateIkReturned: Date;
  dateCreated: Date;
  dateUpdated: Date;
  createdBy: User = new User();
  updatedBy: User = new User();
  uid: string;
  dateRestored: Date;
  canceledReason: string;
  restoredBy: User = new User();
  ikReturnedBy: User = new User();
  observation: string;
  send: Send = new Send();
  transporter: Transporter = new Transporter();
}

/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */

import { User } from '../../users/shared/user';

/**
 * @author Damasceno Lopes
 */
export class Transporter {
transporterId: number;
  name: string;
  role: string;
  phoneNumber: string; 
  uid: string;
  canceled: boolean;
  canceledReason: string;
  createdBy: User = new User();
  updatedBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  canceledBy: string;
}

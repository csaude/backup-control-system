/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { User } from './../../users/shared/user';

/**
 * @author Damasceno Lopes
 */
export class Evaluation {
  evaluationId: number;
  name: string;
  openmrsSqlUuid: string;
  description: string;
  uid: string;
  createdBy: User = new User();
  updatedBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  canceledBy: string;
}

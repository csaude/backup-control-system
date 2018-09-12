/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { User } from './../../users/shared/user';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export class Evaluation {
  evaluation_id: number;
  name: string;
  openmrs_sql_dataset_uuid: string;
  description: string;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
}

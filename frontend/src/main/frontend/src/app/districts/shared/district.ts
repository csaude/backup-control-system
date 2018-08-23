/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Ironkey } from './../../ironkeys/shared/ironkey';
import { User } from './../../users/shared/user';

/**
 * @author Damasceno Lopes
 */
export class District {
  district_id: number;
  province: string;
  name: string;
  namef: string;
  instance_url: string;
  instance_username: string;
  instance_password: string;
  ironkeys: Ironkey[] = [];
  created_by: User = new User();
  ironkeysnumber: number;
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
  canceled: boolean;
  canceled_reason: string;
  parentdistrict: District;
}

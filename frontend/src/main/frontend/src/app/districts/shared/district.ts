/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Ironkey } from './../../ironkeys/shared/ironkey';
import { User } from './../../users/shared/user';

export class District {
  district_id: number;
  province: string;
  name: string;
  instance_url: string;
  instance_username: string;
  instance_password: string;
  ironkeys: Ironkey[] = [];
  created_by: User = new User();
  usersnumber: number;
  ironkeysnumber:number;
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
  canceled: boolean;
  canceled_reason:string;
  parentdistrict: District;
}

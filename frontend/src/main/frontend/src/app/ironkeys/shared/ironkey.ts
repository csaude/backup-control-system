/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';
export class Ironkey {
  ironkey_id: number;
  serial: string;
  size: number;
  version: string;
  observation: string;
  date_purchased: Date;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  status: string;
  districtsnumber: number;
  uuid: string;
  districts: District[] = []
}

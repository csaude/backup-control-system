/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { User } from './../../users/shared/user';
export class Transporter {
  transporter_id: number;
  name: string;
  phone_number: string;
  role: string;
  canceled: boolean;
  canceled_reason: string;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
  canceled_by: User = new User();
}

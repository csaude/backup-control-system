/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Send } from './../../sends/shared/send';
import { Transporter } from './../../transporters/shared/transporter';
import { User } from './../../users/shared/user';
export class Receive {
  receive_id: number;
  receive_date: Date;
  observation: string;
  canceled: boolean;
  canceled_reason: string;
  send: Send = new Send();
  ik_returned: boolean;
  date_ik_returned: Date;
  transporter: Transporter = new Transporter();
  created_by: User = new User();
  updated_by: User = new User();
  restored_by: User = new User();
  date_restored: Date;
  restored: boolean;
  date_created: Date;
  uuid: string;
}

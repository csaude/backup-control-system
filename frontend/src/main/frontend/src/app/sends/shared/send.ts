/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { District } from './../../districts/shared/district';
import { Transporter } from './../../transporters/shared/transporter';
import { User } from './../../users/shared/user';
export class Send {
  send_id: number;
  backup_date: Date;
  update_finished: boolean;
  validation_finished: boolean;
  sync_finished: boolean;
  received: boolean;
  observation: string;
  cross_dhis2_finished: boolean;
  cross_idart_finished: boolean;
  canceled: boolean;
  canceled_reason: string;
  district: District = new District();
  transporter: Transporter = new Transporter();
  created_by: User = new User();
  updated_by: User = new User();
  receivername: string;
  receivedate: Date;
  restored: boolean;
  restorername: string;
  date_restored: Date;
  sis_observation: string;
  ik_returned: boolean;
  ik_returneddate: Date;
  ik_returnedto: String;
  date_created: Date;
  uuid: string;
  ik_received: boolean;
  date_ik_received: Date;
}

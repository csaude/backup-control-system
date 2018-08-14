/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';

export class Server {
  server_id: number;
  name: string;
  type: string;
  observation: string;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
  district: District = new District();
  canceled: boolean;
  canceled_reason: string;
  canceled_by: User = new User();
}
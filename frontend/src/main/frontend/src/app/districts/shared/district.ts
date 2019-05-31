import { Ironkey } from './../../ironkeys/shared/ironkey';
import { User } from './../../users/shared/user';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com> <damascenolopess@gmail.com>
 *
 */
export class District {
  districtId: number;
  parent: District;
  province: string;
  uid: string;
  createdBy: User = new User();
  updatedBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  canceled: boolean;
  canceledReason: string;
  ironkeys: Ironkey[] = [];
  name: string;
  fullName: string;
  instanceUrl: string;
  instanceUsername: string;
  instancePassword: string;
  start_time: string;
  last_backup_idart: string;

  server: string;
  last_backup_restored: String;
  last_backup_received: String;
}

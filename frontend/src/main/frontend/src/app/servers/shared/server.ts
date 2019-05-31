import { User } from '../../users/shared/user';
import { District } from '../../districts/shared/district';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class Server {
  
  //TODO: Delete
  server_id: number;
  districtName: String;
  
  //New props
  serverId: number;
  name: string;
  type: string;
  observation: string;
  district: District = new District();
  createdBy: User = new User();
  updatedBy: User = new User();
  canceledBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  canceled: boolean;
  canceledReason: string;
  uid: string;
  duration: string;
  description: string;

}
import { User } from './../../users/shared/user';

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export class Evaluation {
  evaluationId: number;
  name: string;
  openmrsSqlUuid: string;
  description: string;
  uid: string;
  createdBy: User = new User();
  updatedBy: User = new User();
  dateCreated: Date;
  dateUpdated: Date;
  canceledBy: string;
}

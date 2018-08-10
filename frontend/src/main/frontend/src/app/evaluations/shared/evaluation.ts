/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { User } from './../../users/shared/user';
export class Evaluation {
  evaluation_id: number;
  name: string;
  openmrs_sql_dataset_uuid: string;
  description: string;
  created_by: User = new User();
  updated_by: User = new User();
  date_created: Date;
  uuid: string;
}

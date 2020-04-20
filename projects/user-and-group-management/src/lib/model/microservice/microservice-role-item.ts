import { MicroserviceRole } from 'kypo-user-and-group-model';

/**
 * Input form of microservice role
 */
export class MicroserviceRoleItem {
  role: MicroserviceRole;
  valid: boolean;
}

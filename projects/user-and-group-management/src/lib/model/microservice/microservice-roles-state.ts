import { MicroserviceRole } from './microservice-role.model';

/**
 * State of edited microservice roles
 */
export class MicroserviceRolesState {
  roles: MicroserviceRole[];
  isAdded?: boolean;
  isRemoved?: boolean;
  roleIndex?: number;
  validity: boolean;
}

import {MicroserviceRole} from './microservice-role.model';

export class MicroserviceRolesState {
  roles: MicroserviceRole[];
  isAdded?: boolean;
  isRemoved?: boolean;
  roleIndex?: number;
  validity: boolean;
}

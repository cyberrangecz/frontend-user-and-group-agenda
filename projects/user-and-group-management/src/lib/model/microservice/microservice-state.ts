import {MicroserviceRole} from './microservice-role.model';

export class MicroserviceState {
  name: string;
  endpoint: string;
  roles: MicroserviceRole[];
  valid: boolean;
}

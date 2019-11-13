import {MicroserviceRole} from './microservice-role.model';

export class Microservice {
  name: string;
  endpoint: string;
  roles: MicroserviceRole[];
}

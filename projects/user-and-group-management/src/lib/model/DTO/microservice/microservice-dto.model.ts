import {MicroserviceRoleDTO} from './microservice-role-dto';

export class MicroserviceDTO {
  name: string;
  endpoint: string;
  roles: MicroserviceRoleDTO[];
}

import {MicroserviceRole} from './microservice-role.model';

export class Microservice {
  name: string;
  endpoint: string;
  roles: MicroserviceRole[];
  valid: boolean;

  hasDefaultRole(): boolean {
    return this.roles.some(role => role.default);
  }

  constructor(name: string, endpoint: string, roles: MicroserviceRole[]) {
    this.name = name;
    this.endpoint = endpoint;
    this.roles = roles;
  }
}

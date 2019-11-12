import {Role} from './role.model';

export class MicroserviceState {
  name: string;
  endpoint: string;
  roles: Role[];
  valid: boolean;
}

import {Role} from './role.model';

export class RolesState {
  roles: Role[];
  isAdded?: boolean;
  isRemoved?: boolean;
  roleIndex?: number;
  validity: boolean;
}

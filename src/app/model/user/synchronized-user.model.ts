import {User} from './user.model';
import {Group} from '../group/group.model';
import {Role} from '../role.model';

export class SynchronizedUser extends User {
  isAdmin: boolean;
  isScenarist: boolean;
  roles: Role[];
  groups: Group[];
  source: string;
  canBeDeleted: boolean;
}

import {User} from '../user/user.model';
import {Group} from '../group/group.model';
import {Role} from '../role.model';

export class UserTableDataModel {
  user: User;
  groups: Group[];
  roles: Role[];
  isAdmin: boolean;
  source: string;
}

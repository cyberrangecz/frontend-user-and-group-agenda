import {User} from '../user/user.model';
import {Group} from '../group/group.model';

export class UserTableDataModel {
  user: User;
  groups: Group[];
  isAdmin: boolean;
  source: string;
}

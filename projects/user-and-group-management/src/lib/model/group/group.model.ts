import {User} from '../user/user.model';
import {Role} from '../role.model';

export class Group {
  id: number;
  name: string;
  description: string;
  source: string;
  roles: Role[];
  members: User[];
  canBeDeleted: boolean;
}


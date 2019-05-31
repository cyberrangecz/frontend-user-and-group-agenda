import {User} from '../user/user.model';
import {Role} from '../role/role.model';

export class Group {
  id: number;
  name: string;
  description: string;
  roles: Role[];
  members: User[];
  expirationDate: Date;
  canBeDeleted: boolean;
}


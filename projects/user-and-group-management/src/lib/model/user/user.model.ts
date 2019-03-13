import {Role} from '../role.model';

export class User {
  id: number;
  name: string;
  login: string;
  mail: string;
  roles: Role[];
}

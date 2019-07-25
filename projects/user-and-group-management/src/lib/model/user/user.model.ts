import {Role} from '../role/role.model';

export class User {
  id: number;
  name: string;
  nameWithAcademicTitles: string;
  issuer: string;
  login: string;
  mail: string;
  roles: Role[];
}

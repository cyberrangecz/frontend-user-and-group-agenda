import {RoleDTO} from '../role-dto.model';

export class UserDTO {
  full_name: string;
  id: number;
  login: string;
  mail: string;
  roles: RoleDTO[];
}

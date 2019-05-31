import {RoleDTO} from '../role-dto.model';

export class UserDTO {
  full_name: string;
  given_name: string;
  family_name: string;
  id: number;
  login: string;
  mail: string;
  roles: RoleDTO[];
}

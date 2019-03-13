import {RoleDTO} from '../role-dto.model';

export class UserInfoDTO {
  full_name: string;
  id: number;
  login: string;
  mail: string;
  roles: RoleDTO[];
}

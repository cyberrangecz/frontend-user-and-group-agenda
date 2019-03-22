import {RoleDTO} from '../role-dto.model';
import {UserForGroupsDTO} from '../user/user-for-groups-dto.model';

export class GroupDTO {
  can_be_deleted: boolean;
  description: string;
  id: number;
  name: string;
  roles: RoleDTO[];
  users: UserForGroupsDTO[];
}

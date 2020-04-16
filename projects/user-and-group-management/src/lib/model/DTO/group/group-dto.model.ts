import { RoleDTO } from 'kypo2-auth';
import { UserForGroupsDTO } from '../user/user-for-groups-dto.model';

export class GroupDTO {
  can_be_deleted: boolean;
  description: string;
  id: number;
  name: string;
  roles: RoleDTO[];
  users: UserForGroupsDTO[];
  expiration_date: Date;
}

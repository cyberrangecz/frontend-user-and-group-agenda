import {GroupTableRow} from './group-table-row';
import {Group} from '../group/group.model';

export class GroupTableRowAdapter extends GroupTableRow {
  groupId: number;
  groupName: string;
  groupDescription: string;
  expirationDate: string;
  rolesCount: number;
  membersCount: number;

  constructor(group: Group) {
    super(group);
    this.groupId = group.id;
    this.groupName = group.name;
    this.groupDescription = group.description;
    if (group.expirationDate) {
      this.expirationDate = group.expirationDate.toString();
    } else {
      this.expirationDate = '-';
    }
    this.rolesCount = group.roles.length;
    this.membersCount = group.members.length;
  }
}

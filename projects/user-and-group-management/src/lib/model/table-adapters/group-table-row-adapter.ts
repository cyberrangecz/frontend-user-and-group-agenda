import {Group} from '../group/group.model';

/**
 * Adapter class for group table. Transforms group object to attributes displayable in table
 */
export class GroupTableRowAdapter {
  groupId: number;
  groupName: string;
  groupDescription: string;
  expirationDate: string;
  rolesCount: number;
  membersCount: number;

  constructor(group: Group) {
    this.groupId = group.id;
    this.groupName = group.name;
    this.groupDescription = group.description;
    if (group.expirationDate) {
      this.expirationDate = `${group.expirationDate.getFullYear()}-${group.expirationDate.getMonth()}-${group.expirationDate.getDate()}`;
    } else {
      this.expirationDate = '-';
    }
    this.rolesCount = group.roles.length;
    this.membersCount = group.members.length;
  }
}

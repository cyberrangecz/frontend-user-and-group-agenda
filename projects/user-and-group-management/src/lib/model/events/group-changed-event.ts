import { Group } from 'kypo-user-and-group-model';

/**
 * Event emitted when edited group is changed
 */
export class GroupChangedEvent {
  group: Group;
  isValid: boolean;

  constructor(group: Group, isValid: boolean) {
    this.group = group;
    this.isValid = isValid;
  }
}

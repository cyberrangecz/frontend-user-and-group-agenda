import {Group} from '../group/group.model';

export class GroupChangedEvent {
  group: Group;
  isValid: boolean;

  constructor(group: Group, isValid: boolean) {
    this.group = group;
    this.isValid = isValid;
  }
}

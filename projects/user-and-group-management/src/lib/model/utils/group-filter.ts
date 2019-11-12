import {Filter} from './Filter';

export class GroupFilter {
  static create(filterValue: string): Filter[] {
    if (!filterValue || filterValue === '' || filterValue.trim().length <= 0) {
      return [];
    } else {
      return [new Filter('name', filterValue)];
    }
  }
}

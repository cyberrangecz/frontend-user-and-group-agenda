import {Filter} from './filter';

export class GroupFilter extends Filter {

  constructor(value: string) {
    super('name', value);
  }
}

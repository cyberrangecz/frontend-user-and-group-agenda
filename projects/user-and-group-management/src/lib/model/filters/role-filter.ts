import {Filter} from './filter';

export class RoleFilter extends Filter {

  constructor(value: string) {
    super('roleType', value);
  }
}

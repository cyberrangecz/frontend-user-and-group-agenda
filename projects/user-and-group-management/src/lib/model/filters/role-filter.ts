import {Filter} from './filter';

/**
 * Role specific filter. Filters by role type
 */
export class RoleFilter extends Filter {

  constructor(value: string) {
    super('roleType', value);
  }
}

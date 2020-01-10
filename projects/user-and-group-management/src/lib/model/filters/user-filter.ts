import {Filter} from './filter';

/**
 * User specific filter. Filters by family name
 */
export class UserFilter extends Filter {

  constructor(value: string) {
    super('familyName', value);
  }
}

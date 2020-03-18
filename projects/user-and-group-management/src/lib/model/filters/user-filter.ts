import {KypoFilter} from 'kypo-common';

/**
 * User specific filter. Filters by family name
 */
export class UserFilter extends KypoFilter {

  constructor(value: string) {
    super('familyName', value);
  }
}

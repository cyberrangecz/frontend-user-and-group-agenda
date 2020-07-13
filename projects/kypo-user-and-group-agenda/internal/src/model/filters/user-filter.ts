import { SentinelFilter } from '@sentinel/common';

/**
 * User specific filter. Filters by family name
 */
export class UserFilter extends SentinelFilter {
  constructor(value: string) {
    super('familyName', value);
  }
}

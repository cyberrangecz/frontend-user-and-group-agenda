import { KypoFilter } from 'kypo-common';

/**
 * Role specific filter. Filters by role type
 */
export class RoleFilter extends KypoFilter {
  constructor(value: string) {
    super('roleType', value);
  }
}

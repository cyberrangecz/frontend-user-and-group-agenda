import { SentinelFilter } from '@sentinel/common';

/**
 * Role specific filter. Filters by role type
 */
export class RoleFilter extends SentinelFilter {
  constructor(value: string) {
    super('roleType', value);
  }
}

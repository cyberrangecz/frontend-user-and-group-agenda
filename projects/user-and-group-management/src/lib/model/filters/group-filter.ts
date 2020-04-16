import { KypoFilter } from 'kypo-common';

/**
 * Group specific filter. Filters by name
 */
export class GroupFilter extends KypoFilter {
  constructor(value: string) {
    super('name', value);
  }
}

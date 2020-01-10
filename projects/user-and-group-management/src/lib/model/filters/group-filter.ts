import {Filter} from './filter';

/**
 * Group specific filter. Filters by name
 */
export class GroupFilter extends Filter {

  constructor(value: string) {
    super('name', value);
  }
}

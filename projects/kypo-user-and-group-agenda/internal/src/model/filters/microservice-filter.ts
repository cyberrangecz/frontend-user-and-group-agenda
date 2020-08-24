import { SentinelFilter } from '@sentinel/common';

/**
 * Microservice specific filter. Filters by name
 */
export class MicroserviceFilter extends SentinelFilter {
  constructor(value: string) {
    super('name', value);
  }
}

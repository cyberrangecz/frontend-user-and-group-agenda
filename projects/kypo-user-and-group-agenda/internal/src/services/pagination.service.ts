import { Injectable } from '@angular/core';
import { UserAndGroupContext } from './user-and-group-context.service';

@Injectable()
export class PaginationService {
  constructor(private context: UserAndGroupContext) {}

  /**
   * Returns selected pagination size from local storage or default when none was selected yet
   */
  getPagination(): number {
    const storage = window.localStorage;
    const pagination = storage.getItem('pagination');
    return pagination ? Number(pagination) : this.context.config.defaultPaginationSize;
  }

  /**
   * Sets desired pagination for to local storage
   * @param pagination desired pagination
   */
  setPagination(pagination: number) {
    const storage = window.localStorage;
    storage.setItem('pagination', `${pagination}`);
  }
}

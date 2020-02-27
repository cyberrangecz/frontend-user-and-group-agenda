import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResourceService} from '../shared/paginated-resources.service';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from 'kypo2-table';
import {Group} from '../../model/group/group.model';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 */

@Injectable()
export abstract class Kypo2GroupOverviewService extends PaginatedResourceService<Group> {

  /**
   *
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<Group>>;

  /**
   * Deletes selected groups
   * @param ids ids of a groups to be deleted
   */
  abstract delete(ids: number[]): Observable<any>;
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResourceService} from '../shared/paginated-resources.service';
import {PaginatedResource} from '../../model/table/paginated-resource';
import {RequestedPagination} from 'kypo2-table';
import {Group} from '../../model/group/group.model';
import {SelectablePaginatedService} from '../shared/selectable-paginated.service';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 */

@Injectable()
export abstract class Kypo2GroupOverviewService extends SelectablePaginatedService<Group> {

  /**
   *
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<Group>>;

  /**
   * Deletes group
   * @param group a group to be deleted
   */
  abstract delete(group: Group): Observable<any>;

  abstract deleteSelected(): Observable<any>;

  abstract edit(group: Group): Observable<any>;

  abstract create(): Observable<any>;
}

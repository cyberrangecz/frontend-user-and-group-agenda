import {PaginatedResourceService} from '../shared/paginated-resources.service';
import {Observable} from 'rxjs';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from 'kypo2-table';
import {User} from 'kypo2-auth';
/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 * Subscribe to users$ to receive latest data updates.
 */
export abstract class Kypo2UserOverviewService extends PaginatedResourceService {

  /**
   * @contract must be updated every time new data are received
   */

  abstract users$: Observable<PaginatedResource<User[]>>;

  /**
   * @param pagination requested pagination
   * @param filter filer to be applied on resource
   */
  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<User[]>>;

  /**
   * Deletes selected users
   * @param ids ids of users to be deleted
   */
  abstract delete(ids: number[]): Observable<any>;
}

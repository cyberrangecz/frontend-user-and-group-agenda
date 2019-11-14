import {PaginatedResourceService} from '../shared/paginated-resources.service';
import {Observable} from 'rxjs';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from 'kypo2-table';
import {User} from 'kypo2-auth';

export abstract class Kypo2UserOverviewService extends PaginatedResourceService {

  abstract users$: Observable<PaginatedResource<User[]>>;

  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<User[]>>;

  abstract delete(ids: number[]): Observable<any>;
}

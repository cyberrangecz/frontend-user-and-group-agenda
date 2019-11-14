import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResourceService} from '../shared/paginated-resources.service';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from 'kypo2-table';
import {Group} from '../../model/group/group.model';

@Injectable()
export abstract class GroupOverviewService extends PaginatedResourceService {

  abstract groups$: Observable<PaginatedResource<Group[]>>;

  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<Group[]>>;

  abstract delete(ids: number[]): Observable<any>;
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResourceService} from './paginated-resources.service';
import {TableAdapter} from '../../model/table-adapters/table-adapter';
import {RequestedPagination} from 'kypo2-table';
import {GroupTableRow} from '../../model/table-adapters/group-table-row';

@Injectable()
export abstract class GroupOverviewService extends PaginatedResourceService {

  abstract groups$: Observable<TableAdapter<GroupTableRow[]>>;

  abstract getAll(pagination?: RequestedPagination, filter?: string);

  abstract deleteGroups(ids: number[]): Observable<any>;

  abstract delete(id: number): Observable<any>;
}

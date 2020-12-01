import { SelectablePaginatedService } from '@kypo/user-and-group-agenda/internal';
import { Microservice } from '@kypo/user-and-group-model';
import { RequestedPagination, PaginatedResource } from '@sentinel/common';
import { Observable } from 'rxjs';

export abstract class MicroserviceOverviewService extends SelectablePaginatedService<Microservice> {
  protected constructor(pageSize: number) {
    super(pageSize);
  }

  /**
   *
   * @param pagination requested pagination
   * @param filter filter to be applied on microservices
   */
  abstract getAll(pagination?: RequestedPagination, filter?: string): Observable<PaginatedResource<Microservice>>;

  abstract register(): Observable<any>;
}

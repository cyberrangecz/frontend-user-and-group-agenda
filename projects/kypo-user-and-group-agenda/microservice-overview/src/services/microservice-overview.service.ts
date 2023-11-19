import { SelectablePaginatedService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { OffsetPaginationEvent, PaginatedResource, PaginationBaseEvent } from '@sentinel/common/pagination';
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
  abstract getAll(pagination?: PaginationBaseEvent, filter?: string): Observable<PaginatedResource<Microservice>>;

  abstract register(): Observable<any>;
}

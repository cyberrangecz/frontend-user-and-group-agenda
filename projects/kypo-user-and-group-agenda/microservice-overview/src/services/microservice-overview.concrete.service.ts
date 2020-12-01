import { MicroserviceFilter } from '@kypo/user-and-group-agenda/internal';
import { UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import { Injectable } from '@angular/core';
import { MicroserviceOverviewService } from './microservice-overview.service';
import { RequestedPagination, PaginatedResource } from '@sentinel/common';
import { MicroserviceApi } from '@kypo/user-and-group-api';
import { Router } from '@angular/router';
import { Microservice } from '@kypo/user-and-group-model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserAndGroupNavigator, UserAndGroupErrorHandler } from '@kypo/user-and-group-agenda';

@Injectable()
export class MicroserviceOverviewConcreteService extends MicroserviceOverviewService {
  private lastPagination: RequestedPagination;
  private lastFilter: string;

  constructor(
    private api: MicroserviceApi,
    private router: Router,
    private configService: UserAndGroupContext,
    private navigator: UserAndGroupNavigator,
    private errorHandler: UserAndGroupErrorHandler
  ) {
    super(configService.config.defaultPaginationSize);
  }

  /**
   * Gets all microservices with requested pagination and filters, updates related observables or handles an error
   * @param pagination requested pagination
   * @param filter filter to be applied on microservices
   */
  getAll(pagination: RequestedPagination, filter: string = null): Observable<PaginatedResource<Microservice>> {
    this.lastPagination = pagination;
    this.lastFilter = filter;
    this.clearSelection();
    const filters = filter ? [new MicroserviceFilter(filter)] : [];
    this.hasErrorSubject$.next(false);
    return this.api.getAll(pagination, filters).pipe(
      tap(
        (microservices) => {
          this.resourceSubject$.next(microservices);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching microservices');
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  register(): Observable<any> {
    this.router.navigate([this.navigator.toNewMicroservice()]);
    return of(true);
  }
}

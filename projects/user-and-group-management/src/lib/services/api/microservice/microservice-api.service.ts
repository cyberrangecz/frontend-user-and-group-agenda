import { KypoFilter, KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { Observable } from 'rxjs';
import { Microservice } from '../../../model/microservice/microservice.model';

/**
 * Service abstracting http communication with microservice endpoints.
 */
export abstract class MicroserviceApi {
  /**
   * Creates new microservice
   * @param microservice microservice to be created
   */
  abstract create(microservice: Microservice): Observable<any>;

  /**
   * Sends http request to get paginated microservices
   * @param pagination requested pagination
   * @param filter filter to be applied on microservices
   */
  abstract getAll(
    pagination: KypoRequestedPagination,
    filter?: KypoFilter[]
  ): Observable<KypoPaginatedResource<Microservice>>;
}

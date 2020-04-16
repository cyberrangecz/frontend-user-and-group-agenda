import { Injectable } from '@angular/core';
import { Microservice } from '../../../model/microservice/microservice.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MicroserviceCreateDTO, MicroserviceDTO } from '../../../model/DTO/microservice/microservice-dto.model';
import { Observable } from 'rxjs';
import { MicroserviceMapper } from '../../../model/mappers/microservice.mapper';
import { UserAndGroupConfig } from '../../../model/client/user-and-group-config';
import { UserAndGroupContext } from '../../shared/user-and-group-context.service';
import { MicroserviceApi } from './microservice-api.service';
import { RestResourceDTO } from '../../../model/DTO/rest-resource-dto.model';
import { FilterParams } from '../../../model/other/filter-params';
import { PaginationHttpParams } from '../../../model/other/pagination-http-params';
import { KypoRequestedPagination, KypoParamsMerger, KypoFilter, KypoPaginatedResource } from 'kypo-common';
import { map } from 'rxjs/operators';

/**
 * Implementation of http communication with microservice endpoints.
 */
@Injectable()
export class MicroserviceDefaultApi extends MicroserviceApi {

  private readonly config: UserAndGroupConfig;

  constructor(private http: HttpClient,
    private configService: UserAndGroupContext) {
    super();
    this.config = this.configService.config;
  }

  /**
   * Creates new microservice
   * @param microservice microservice to be created
   */
  create(microservice: Microservice): Observable<any> {
    return this.http.post<MicroserviceCreateDTO>(`${this.config.userAndGroupRestBasePath}microservices`,
      JSON.stringify(MicroserviceMapper.mapMicroserviceToMicroserviceCreateDTO(microservice)),
      { headers: this.createDefaultHeaders() }
    );
  }

  private createDefaultHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Sends http request to get paginated microservices
   * @param pagination requested pagination
   * @param filter filter to be applied on microservices
   */
  getAll(pagination: KypoRequestedPagination, filter?: KypoFilter[]): Observable<KypoPaginatedResource<Microservice>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<MicroserviceDTO>>(`${this.config.userAndGroupRestBasePath}microservices`,
      { params: params })
      .pipe(map(resp => MicroserviceMapper.mapMicroserviceDTOsToMicroservices(resp)));
  }
}

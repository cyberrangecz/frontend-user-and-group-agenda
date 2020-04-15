import {Injectable} from '@angular/core';
import {Microservice} from '../../../model/microservice/microservice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MicroserviceCreateDTO} from '../../../model/DTO/microservice/microservice-dto.model';
import {Observable} from 'rxjs';
import {MicroserviceMapper} from '../../../model/mappers/microservice.mapper';
import {UserAndGroupConfig} from '../../../model/client/user-and-group-config';
import {UserAndGroupContext} from '../../shared/user-and-group-context.service';
import {MicroserviceApi} from './microservice-api.service';

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
      {headers: this.createDefaultHeaders()}
    );
  }

  private createDefaultHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}

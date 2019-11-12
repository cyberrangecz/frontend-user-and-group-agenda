import {Injectable} from '@angular/core';
import {Microservice} from '../../../model/microservice/microservice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MicroserviceDTO} from '../../../model/DTO/microservice/microservice-dto.model';
import {Observable} from 'rxjs';
import {MicroserviceMapperService} from './microservice-mapper.service';
import {UserAndGroupManagementConfig} from '../../../config/user-and-group-management-config';
import {ConfigService} from '../../../config/config.service';

@Injectable()
export class MicroserviceFacadeService {

  private readonly config: UserAndGroupManagementConfig;


  constructor(private http: HttpClient,
              private configService: ConfigService,
              private microserviceMapperService: MicroserviceMapperService) {
    this.config = this.configService.config;
  }

  createMicroservice(microservice: Microservice): Observable<any> {
    return this.http.post<MicroserviceDTO>(`${this.config.userAndGroupRestBasePath}microservices`,
      JSON.stringify(this.microserviceMapperService.mapMicroserviceToMicroserviceDTO(microservice)),
      {headers: this.createDefaultHeaders()}
    );
  }

  private createDefaultHeaders() {

    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}

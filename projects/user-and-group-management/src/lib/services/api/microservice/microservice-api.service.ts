import {Microservice} from '../../../model/microservice/microservice.model';
import {Observable} from 'rxjs';

/**
 * Service abstracting http communication with microservice endpoints.
 */
export abstract class MicroserviceApi {

  /**
   * Creates new microservice
   * @param microservice microservice to be created
   */
  abstract create(microservice: Microservice): Observable<any>;
}

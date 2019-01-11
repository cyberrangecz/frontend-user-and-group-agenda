import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class RoleFacadeService {

  constructor(private http: HttpClient) {
  }

  getRoles(pagination = null) {
    if (pagination) {
      // request with pagination
    }
    return this.http.get(environment.userAndGroupRestBasePath + environment.usersPathExtension);
  }

  getRolesById(id: number) {
    return this.http.get(environment.userAndGroupRestBasePath + environment.usersPathExtension + '/' + id);
  }
}

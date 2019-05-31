import {Injectable} from '@angular/core';
import {AlertService} from './alert.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Alert} from '../../model/alert/alert.model';
import {AlertType} from '../../model/enums/alert-type.enum';

@Injectable()
export class ErrorHandlerService {

  constructor(private alertService: AlertService) {
  }

  displayInAlert(err: HttpErrorResponse, operation: string) {
    if (!err || err.status === 404 || err.status === 0) {
      this.alertService.addAlert(new Alert(AlertType.ERROR,
        `${operation} failed. Cannot reach the server`));
    } else if (err.status === 401) {
      this.alertService.addAlert(new Alert(AlertType.ERROR,
        `${operation} failed because you are unauthorized. Try to refresh page or login again`));
    } else if (err.status === 403) {
      this.alertService.addAlert(new Alert(AlertType.ERROR,
        `${operation} failed. You may not have access rights to requested resource. Contact system administrator.`));
    } else {
      this.alertService.addAlert(new Alert(AlertType.ERROR,
        `${operation} failed with following message: ${err.error.message}`));
    }
  }
}

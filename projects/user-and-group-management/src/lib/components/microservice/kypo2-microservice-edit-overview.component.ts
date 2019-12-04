import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Microservice} from '../../model/microservice/microservice.model';
import {MicroserviceFacadeService} from '../../services/facade/microservice/microservice-facade.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../services/routing/kypo2-user-and-group-routing-event.service';
import {Observable, of} from 'rxjs';
import {ConfirmationDialogInput} from '../shared/confirmation-dialog/confirmation-dialog.input';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import {map, take} from 'rxjs/operators';
import {DialogResultEnum} from '../../model/enums/dialog-result.enum';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'kypo2-microservice-edit-overview',
  templateUrl: './kypo2-microservice-edit-overview.component.html',
  styleUrls: ['./kypo2-microservice-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2MicroserviceEditOverviewComponent implements OnInit {

  microservice: Microservice;
  hasDefaultRole: boolean;
  isFormValid: boolean;
  canDeactivateForm = true;

  constructor(public dialog: MatDialog,
              private microserviceFacadeService: MicroserviceFacadeService,
              private routingService: Kypo2UserAndGroupRoutingEventService,
              private errorHandler: Kypo2UserAndGroupErrorService) { }

  ngOnInit() {
    this.initMicroservice();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.canDeactivateForm) {
      const dialogData = new ConfirmationDialogInput();
      dialogData.title = 'Unsaved changes';
      dialogData.content = `Do you want to leave without saving?`;

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: dialogData});
      return dialogRef.afterClosed()
        .pipe(
          take(1),
          map(result => result === DialogResultEnum.SUCCESS)
        );
    } else {
      return of(true);
    }
  }

  onChange(microservice: Microservice) {
    if (microservice.valid) {
      this.microservice.name = microservice.name;
      this.microservice.endpoint = microservice.endpoint;
      this.microservice.roles = microservice.roles;
    }
    this.hasDefaultRole = microservice.hasDefaultRole();
    this.isFormValid = this.hasDefaultRole && microservice.valid;
    this.canDeactivateForm = false;
  }

  create() {
    this.microserviceFacadeService.createMicroservice(this.microservice)
      .subscribe(
        _ => {
          this.routingService.navigate({ resourceType: 'GROUP' });
          this.canDeactivateForm = true;
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Creating microservice'))
      );
  }

  private initMicroservice() {
    this.microservice = new Microservice('', '', []);
  }

}

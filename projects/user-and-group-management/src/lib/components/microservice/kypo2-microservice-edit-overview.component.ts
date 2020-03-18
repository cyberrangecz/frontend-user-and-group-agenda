import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Microservice} from '../../model/microservice/microservice.model';
import {MicroserviceApi} from '../../services/api/microservice/microservice-api.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../services/routing/kypo2-user-and-group-routing-event.service';

/**
 * Main smart component of microservice edit page
 */
@Component({
  selector: 'kypo2-microservice-edit-overview',
  templateUrl: './kypo2-microservice-edit-overview.component.html',
  styleUrls: ['./kypo2-microservice-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2MicroserviceEditOverviewComponent implements OnInit {

  /**
   * Edited/created microservice
   */
  microservice: Microservice;

  /**
   * True if microservice has default role, false otherwise
   */
  hasDefaultRole: boolean;

  /**
   * True if microservice edit form is valid, false otherwise
   */
  isFormValid: boolean;

  /**
   * True if form data are saved, false otherwise
   */
  canDeactivateForm = true;

  constructor(private microserviceApi: MicroserviceApi,
              private routingService: Kypo2UserAndGroupRoutingEventService,
              private errorHandler: Kypo2UserAndGroupErrorService) { }

  ngOnInit() {
    this.initMicroservice();
  }

  /**
   * True if data in the component are saved and user can navigate to different page, false otherwise
   */
  canDeactivate(): boolean {
    return this.canDeactivateForm;
  }

  /**
   * Changes internal state of the component when microservice is edited
   * @param microservice edited microservice
   */
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

  /**
   * Calls service to create microservice and handles eventual error
   */
  create() {
    this.microserviceApi.create(this.microservice)
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

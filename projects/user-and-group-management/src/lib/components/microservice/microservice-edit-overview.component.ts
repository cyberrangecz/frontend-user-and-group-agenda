import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Microservice} from '../../model/microservice/microservice.model';
import {MicroserviceFacadeService} from '../../services/facade/microservice/microservice-facade.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../services/routing/kypo2-user-and-group-routing-event.service';

@Component({
  selector: 'kypo2-microservice-edit-overview',
  templateUrl: './microservice-edit-overview.component.html',
  styleUrls: ['./microservice-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceEditOverviewComponent implements OnInit {

  microservice: Microservice;
  hasDefaultRole: boolean;
  isFormValid: boolean;

  constructor(private microserviceFacadeService: MicroserviceFacadeService,
              private routingService: Kypo2UserAndGroupRoutingEventService,
              private errorHandler: Kypo2UserAndGroupErrorService) { }

  ngOnInit() {
    this.initMicroservice();
  }

  onChange(microservice: Microservice) {
    if (microservice.valid) {
      this.microservice.name = microservice.name;
      this.microservice.endpoint = microservice.endpoint;
      this.microservice.roles = microservice.roles;
    }
    this.hasDefaultRole = microservice.hasDefaultRole();
    this.isFormValid = this.hasDefaultRole && microservice.valid;
  }

  create() {
    this.microserviceFacadeService.createMicroservice(this.microservice)
      .subscribe(
        _ => this.routingService.navigate({ resourceType: 'GROUP' }),
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Creating microservice'))
      );
  }

  private initMicroservice() {
    this.microservice = new Microservice('', '', []);
  }

}

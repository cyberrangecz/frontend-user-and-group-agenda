import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Microservice } from '../../model/microservice/microservice.model';
import { MicroserviceApi } from '../../services/api/microservice/microservice-api.service';
import { UserAndGroupErrorHandler } from '../../services/client/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../../services/client/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../../services/client/user-and-group-notification.service';

/**
 * Main smart component of microservice edit page
 */
@Component({
  selector: 'kypo2-microservice-edit-overview',
  templateUrl: './microservice-edit-overview.component.html',
  styleUrls: ['./microservice-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditOverviewComponent implements OnInit {
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

  constructor(
    private api: MicroserviceApi,
    private navigator: UserAndGroupNavigator,
    private router: Router,
    private notificationService: UserAndGroupNotificationService,
    private errorHandler: UserAndGroupErrorHandler
  ) {}

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
    this.api.create(this.microservice).subscribe(
      (_) => {
        this.router.navigate([this.navigator.toGroupOverview()]);
        this.notificationService.emit('success', 'Microservice was created');
        this.canDeactivateForm = true;
      },
      (err) => this.errorHandler.emit(err, 'Creating microservice')
    );
  }

  private initMicroservice() {
    this.microservice = new Microservice('', '', []);
  }
}

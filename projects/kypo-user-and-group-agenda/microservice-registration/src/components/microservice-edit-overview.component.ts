import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MicroserviceApi } from '@muni-kypo-crp/user-and-group-api';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import {
  UserAndGroupErrorHandler,
  UserAndGroupNavigator,
  UserAndGroupNotificationService,
} from '@muni-kypo-crp/user-and-group-agenda';

/**
 * Main smart component of microservice-registration state page
 */
@Component({
  selector: 'kypo-microservice-edit-overview',
  templateUrl: './microservice-edit-overview.component.html',
  styleUrls: ['./microservice-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditOverviewComponent implements OnInit {
  /**
   * Edited/created microservice-registration
   */
  microservice: Microservice;

  /**
   * True if microservice-registration has default role, false otherwise
   */
  hasDefaultRole: boolean;

  /**
   * True if microservice-registration state form is valid, false otherwise
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

  ngOnInit(): void {
    this.initMicroservice();
  }

  /**
   * True if data in the component are saved and user can navigate to different page, false otherwise
   */
  canDeactivate(): boolean {
    return this.canDeactivateForm;
  }

  /**
   * Changes internal state of the component when microservice-registration is edited
   * @param microservice edited microservice-registration
   */
  onChange(microservice: Microservice): void {
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
   * Calls service to create microservice-registration and handles eventual error
   */
  create(): void {
    this.api.create(this.microservice).subscribe(
      () => {
        this.router.navigate([this.navigator.toMicroserviceOverview()]);
        this.notificationService.emit('success', 'Microservice was created');
        this.canDeactivateForm = true;
      },
      (err) => this.errorHandler.emit(err, 'Creating microservice-registration')
    );
  }

  private initMicroservice() {
    this.microservice = new Microservice('', '', []);
  }
}

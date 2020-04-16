import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MicroserviceRoleItem } from '../../../model/microservice/microservice-role-item';
import { MicroserviceRole } from '../../../model/microservice/microservice-role.model';
import { MicroserviceRolesState } from '../../../model/microservice/microservice-roles-state';

/**
 * Class containing list of microservice roles
 */
@Component({
  selector: 'kypo2-microservice-role-list',
  templateUrl: './microservice-role-list.component.html',
  styleUrls: ['./microservice-role-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceRoleListComponent implements OnInit, OnChanges {
  /**
   * Roles of microservice
   */
  roles: MicroserviceRole[] = [];

  /**
   * True if roles form is valid, false otherwise
   */
  rolesFormValidity = true;

  /**
   * List of validity of individual roles
   */
  rolesValidity: boolean[] = [];

  /**
   * Emits state of microservice roles
   */
  @Output() microserviceRoles: EventEmitter<MicroserviceRolesState> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  /**
   * Adds new microservice role
   */
  addRole() {
    this.roles.push(this.createRole());
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: false,
      isAdded: true,
    });
  }

  /**
   * Deletes role on given index
   * @param index index of a role to be deleted
   */
  deleteRole(index: number) {
    this.roles.splice(index, 1);
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: this.rolesFormValidity,
      isRemoved: true,
      roleIndex: index,
    });
  }

  /**
   * Handles role change by changing internal component state and emits change event
   * @param event event containing data about role change
   * @param index index of changed role
   */
  onRoleChange(event: MicroserviceRoleItem, index: number) {
    this.roles[index] = event.role;
    this.rolesFormValidity = this.updateValidity(event.valid, index);
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: this.rolesFormValidity,
      roleIndex: index,
    });
  }

  private updateValidity(isUpdatedValid: boolean, index: number): boolean {
    this.rolesValidity[index] = isUpdatedValid;
    return this.rolesValidity.every((roleValidity) => roleValidity);
  }

  private createRole(): MicroserviceRole {
    const role = new MicroserviceRole();
    role.default = false;
    role.description = '';
    role.type = '';
    return role;
  }
}

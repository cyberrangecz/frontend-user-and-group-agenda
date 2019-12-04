import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MicroserviceRole} from '../../../model/microservice/microservice-role.model';
import {MicroserviceRoleItem} from '../../../model/microservice/microservice-role-item';
import {MicroserviceRolesState} from '../../../model/microservice/microservice-roles-state';

@Component({
  selector: 'kypo2-microservice-role-list',
  templateUrl: './microservice-role-list.component.html',
  styleUrls: ['./microservice-role-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceRoleListComponent implements OnInit, OnChanges {

  roles: MicroserviceRole[] = [];
  rolesFormValidity = true;
  rolesValidity: boolean[] = [];

  @Output() microserviceRoles: EventEmitter<MicroserviceRolesState> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  addRole() {
    this.createRole();
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: false,
      isAdded: true,
    });
  }

  removeRole(index: number) {
    this.roles.splice(index, 1);
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: this.rolesFormValidity,
      isRemoved: true,
      roleIndex: index
    });
  }

  onRoleChange(event: MicroserviceRoleItem, index: number) {
    this.roles[index] = event.role;
    this.rolesFormValidity = this.updateValidity(event.valid, index);
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: this.rolesFormValidity,
      roleIndex: index
    });
  }

  private updateValidity(isUpdatedValid: boolean, index: number): boolean {
    this.rolesValidity[index] = isUpdatedValid;
    return this.rolesValidity.every(roleValidity => roleValidity);
  }

  private createRole() {
    this.roles.push({
      default: false,
      description: '',
      type: ''
    });
  }
}

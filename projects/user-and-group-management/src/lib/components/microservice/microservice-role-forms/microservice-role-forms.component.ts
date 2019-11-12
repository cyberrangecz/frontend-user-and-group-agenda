import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Role} from '../../../model/microservice/role.model';
import {RoleItem} from '../../../model/microservice/role-item';
import {RolesState} from '../../../model/microservice/roles-state';

@Component({
  selector: 'kypo2-microservice-role-forms',
  templateUrl: './microservice-role-forms.component.html',
  styleUrls: ['./microservice-role-forms.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceRoleFormsComponent implements OnInit, OnChanges {

  roles: Role[] = [];
  rolesFormValidity = true;
  rolesValidity: boolean[] = [];

  @Input() cleared: boolean;
  @Output() microserviceRoles: EventEmitter<RolesState> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.addRole();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('cleared' in changes) {
      if (this.cleared) {
        this.roles = [];
        this.addRole();
      }
    }
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

  onRoleChange(event: RoleItem, index: number) {
    this.roles[index] = event.role;
    this.rolesFormValidity = this.updateValidity(event.valid, index);
    this.microserviceRoles.emit({
      roles: this.roles,
      validity: this.rolesFormValidity,
      roleIndex: index
    });
  }

  private updateValidity(valid: boolean, index: number): boolean {
    let validity = true;
    this.rolesValidity[index] = valid;

    this.rolesValidity.forEach( roleState => {
      if (!roleState) {
        validity = roleState;
      }
    });
    return validity;
  }

  private createRole() {
    this.roles.push({
      default: false,
      description: '',
      type: ''
    });
  }
}

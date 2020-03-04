import {Column, Kypo2Table, Row} from 'kypo2-table';
import {defer, of} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {Kypo2RoleAssignService} from '../../../services/role/kypo2-role-assign.service';
import {RoleDeleteAction} from './role-delete-action';

/**
 * Class creating data source for role table
 */
export class GroupRolesTable extends Kypo2Table<UserRole> {

  constructor(resource: UserRole[], groupId: number, service: Kypo2RoleAssignService) {
    const columns = [
      new Column('id', 'id', false),
      new Column('microserviceId', 'microservice id', false),
      new Column('roleType', 'role type', false),
      new Column('microserviceName', 'microservice name', false),
    ];
    const rows = resource
      .map(role => new Row(role, [
        new RoleDeleteAction(
          of(false),
          defer(() => service.unassign(groupId, [role])))
      ]));
    super(rows, columns);
    this.selectable = true;
  }
}

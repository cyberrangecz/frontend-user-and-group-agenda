import {Column, Kypo2Table, Row} from 'kypo2-table';
import {defer, of} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {Kypo2RoleAssignService} from '../../../services/role/kypo2-role-assign.service';
import {RoleDeleteAction} from './role-delete-action';
import {KypoPaginatedResource} from 'kypo-common';

/**
 * Class creating data source for role table
 */
export class GroupRolesTable extends Kypo2Table<UserRole> {

  constructor(resource: KypoPaginatedResource<UserRole>, groupId: number, service: Kypo2RoleAssignService) {
    const columns = [
      new Column('id', 'id', true),
      new Column('microserviceId', 'microservice id', false),
      new Column('roleType', 'role type', true, 'roleType'),
      new Column('microserviceName', 'microservice name', false),
    ];
    const rows = resource.elements
      .map(role => new Row(role, [
        new RoleDeleteAction(
          of(false),
          defer(() => service.unassign(groupId, [role])))
      ]));
    super(rows, columns);
    this.pagination = resource.pagination;
    this.selectable = true;
    this.filterable = true;
    this.filterLabel = 'Filter by microservice name';
  }
}

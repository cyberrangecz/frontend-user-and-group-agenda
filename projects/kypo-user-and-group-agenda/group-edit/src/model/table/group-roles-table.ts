import { PaginatedResource } from '@sentinel/common';
import { UserRole } from '@kypo/user-and-group-model';
import { Column, SentinelTable, Row } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { RoleAssignService } from '../../services/state/role-assign/role-assign.service';
import { RoleDeleteAction } from './role-delete-action';

/**
 * Class creating data source for role table
 */
export class GroupRolesTable extends SentinelTable<UserRole> {
  constructor(resource: PaginatedResource<UserRole>, groupId: number, service: RoleAssignService) {
    const columns = [
      new Column('id', 'id', true),
      new Column('microserviceId', 'microservice-registration id', false),
      new Column('roleType', 'role type', true, 'roleType'),
      new Column('microserviceName', 'microservice-registration name', false),
    ];
    const rows = resource.elements.map(
      (role) =>
        new Row(role, [
          new RoleDeleteAction(
            of(false),
            defer(() => service.unassign(groupId, [role]))
          ),
        ])
    );
    super(rows, columns);
    this.pagination = resource.pagination;
    this.selectable = true;
    this.filterable = true;
    this.filterLabel = 'Filter by microservice-registration name';
  }
}

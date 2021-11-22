import { PaginatedResource } from '@sentinel/common';
import { UserRole } from '@muni-kypo-crp/user-and-group-model';
import { Column, Row, RowExpand, SentinelTable } from '@sentinel/components/table';
import { RoleExpandComponent } from '../components/role-expand/role-expand.component';

/**
 * @dynamic
 */
export class RolesDetailTable extends SentinelTable<UserRole> {
  constructor(resource: PaginatedResource<UserRole>) {
    const columns = [
      new Column('roleType', 'role type', true, 'roleType'),
      new Column('microserviceName', 'microservice name', false),
    ];
    const rows = resource.elements.map((element) => RolesDetailTable.createRow(element));
    super(rows, columns);
    this.expand = new RowExpand(RoleExpandComponent);
    this.filterable = true;
    this.filterLabel = 'Filter by role type';
    this.pagination = resource.pagination;
  }

  private static createRow(role: UserRole): Row<UserRole> {
    const row = new Row(role);
    return row;
  }
}

import { PaginatedResource } from '@sentinel/common';
import { Group } from 'kypo-user-and-group-model';
import { Column, SentinelTable, Row, RowAction } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { GroupOverviewService } from '../../services/group-overview.service';
import { GroupDeleteAction } from './group-delete-action';
import { GroupEditAction } from './group-edit-action';
import { GroupRowAdapter } from './group-row-adapter';

/**
 * @dynamic
 * Class creating data source for group-overview table
 */
export class GroupTable extends SentinelTable<GroupRowAdapter> {
  constructor(resource: PaginatedResource<Group>, service: GroupOverviewService) {
    const rows = resource.elements.map((element) => GroupTable.createRow(element, service));
    const columns = [
      new Column('id', 'id', false),
      new Column('name', 'name', true),
      new Column('description', 'description', false),
      new Column('expirationDateFormatted', 'expiration date', false),
      new Column('rolesCount', 'roles count', false),
      new Column('membersCount', 'members count', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by name';
    this.selectable = true;
  }

  private static createRow(group: Group, service: GroupOverviewService): Row<GroupRowAdapter> {
    const rowAdapter = group as GroupRowAdapter;
    if (rowAdapter.expirationDate) {
      rowAdapter.expirationDateFormatted = `${group.expirationDate.getFullYear()}-${group.expirationDate.getMonth()}
      -${group.expirationDate.getDate()}`;
    } else {
      rowAdapter.expirationDateFormatted = '-';
    }
    rowAdapter.rolesCount = rowAdapter.roles ? rowAdapter.roles.length : 0;
    rowAdapter.membersCount = rowAdapter.members ? rowAdapter.members.length : 0;
    return new Row(rowAdapter, GroupTable.createActions(group, service));
  }

  private static createActions(group: Group, service: GroupOverviewService): RowAction[] {
    return [
      new GroupEditAction(
        of(false),
        defer(() => service.edit(group))
      ),
      new GroupDeleteAction(
        of(false),
        defer(() => service.delete(group))
      ),
    ];
  }
}

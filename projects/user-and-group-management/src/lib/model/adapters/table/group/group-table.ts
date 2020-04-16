import { KypoPaginatedResource } from 'kypo-common';
import { Column, Kypo2Table, Row } from 'kypo2-table';
import { defer, of } from 'rxjs';
import { GroupOverviewService } from '../../../../services/group/group-overview.service';
import { Group } from '../../../group/group.model';
import { GroupDeleteAction } from './group-delete-action';
import { GroupEditAction } from './group-edit-action';
import { GroupTableRowAdapter } from './group-table-row-adapter';

/**
 * Class creating data source for group table
 */
export class GroupTable extends Kypo2Table<GroupTableRowAdapter> {
  constructor(resource: KypoPaginatedResource<Group>, service: GroupOverviewService) {
    const rowAdapters = GroupTable.mapGroupToTableAdapter(resource);
    const rows = rowAdapters.elements.map(
      (adapter) =>
        new Row(adapter, [
          new GroupEditAction(
            of(false),
            defer(() => service.edit(adapter.group))
          ),
          new GroupDeleteAction(
            of(false),
            defer(() => service.delete(adapter.group))
          ),
        ])
    );

    const columns = [
      new Column('groupId', 'id', false),
      new Column('groupName', 'name', true),
      new Column('groupDescription', 'description', false),
      new Column('expirationDate', 'expiration date', false),
      new Column('rolesCount', 'roles count', false),
      new Column('membersCount', 'members count', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by name';
    this.selectable = true;
  }

  private static mapGroupToTableAdapter(
    resource: KypoPaginatedResource<Group>
  ): KypoPaginatedResource<GroupTableRowAdapter> {
    const elements = resource.elements.map((group) => new GroupTableRowAdapter(group));
    return new KypoPaginatedResource<GroupTableRowAdapter>(elements, resource.pagination);
  }
}

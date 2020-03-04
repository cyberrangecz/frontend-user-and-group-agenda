import {Column, Kypo2Table, Row} from 'kypo2-table';
import {GroupTableRowAdapter} from './group-table-row-adapter';
import {PaginatedResource} from '../paginated-resource';
import {defer, of} from 'rxjs';
import {Group} from '../../group/group.model';
import {GroupEditAction} from './group-edit-action';
import {GroupDeleteAction} from './group-delete-action';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';

/**
 * Class creating data source for group table
 */
export class GroupTable extends Kypo2Table<GroupTableRowAdapter> {

  constructor(resource: PaginatedResource<Group>, service: Kypo2GroupOverviewService) {
    const rowAdapters = GroupTable.mapGroupToTableAdapter(resource);
    const rows = rowAdapters.elements
      .map(adapter => new Row(adapter, [
        new GroupEditAction(
          of(false),
          defer(() => service.edit(adapter.group))
        ),
        new GroupDeleteAction(
          of(false),
          defer(() => service.delete(adapter.group))
        )
      ]));

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

  private static mapGroupToTableAdapter(resource: PaginatedResource<Group>): PaginatedResource<GroupTableRowAdapter> {
    const elements = resource.elements.map(group => new GroupTableRowAdapter(group));
    return new PaginatedResource<GroupTableRowAdapter>(elements, resource.pagination);
  }
}

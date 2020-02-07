import {Column, Kypo2Table, Row} from 'kypo2-table';
import {GroupTableRowAdapter} from './group-table-row-adapter';
import {PaginatedResource} from './paginated-resource';
import {of} from 'rxjs';
import {Group} from '../group/group.model';

/**
 * Class creating data source for group table
 */
export class GroupTableCreator {

  static readonly EDIT_ACTION_ID = 'edit';
  static readonly DELETE_ACTION_ID = 'delete';

  /**
   * Create data source for groups table from paginated groups
   * @param resource paginated groups to be transformed into table data source
   */
  static create(resource: PaginatedResource<Group[]>): Kypo2Table<GroupTableRowAdapter> {

    const resources = this.mapGroupToTableAdapter(resource);
    const actions = [
      {
        id: this.EDIT_ACTION_ID,
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        tooltip: 'Edit Group',
        disabled$: of(false)
      },
      {
        id: this.DELETE_ACTION_ID,
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete Group',
        disabled$: of(false)
      }
    ];

    const table = new Kypo2Table<GroupTableRowAdapter>(
      resources.elements.map(group => new Row(group, actions)),
      [
        new Column('groupId', 'id', false),
        new Column('groupName', 'name', true),
        new Column('groupDescription', 'description', false),
        new Column('expirationDate', 'expiration date', false),
        new Column('rolesCount', 'roles count', false),
        new Column('membersCount', 'members count', false),
      ]
    );
    table.pagination = resources.pagination;
    table.filterable = true;
    table.filterLabel = 'Filter by name';
    table.selectable = true;
    return table;
  }

  private static mapGroupToTableAdapter(resource: PaginatedResource<Group[]>): PaginatedResource<GroupTableRowAdapter[]> {
    const elements = resource.elements.map(group => new GroupTableRowAdapter(group));
    return new PaginatedResource<GroupTableRowAdapter[]>(elements, resource.pagination);
  }
}

import {Column, Kypo2Table, Row} from 'kypo2-table';
import {GroupTableRowAdapter} from './group-table-row-adapter';
import {TableAdapter} from './table-adapter';
import {GroupTableRow} from './group-table-row';
import {of} from 'rxjs';

export class GroupTableCreator {
  static create(resource: TableAdapter<GroupTableRow[]>): Kypo2Table<GroupTableRowAdapter> {

    const resources = this.mapGroupTableRowToGroupTableModel(resource);
    const actions = [
      {
        label: 'Edit Group',
        icon: 'edit',
        color: 'primary',
        tooltip: 'Edit Group',
        disabled$: of(false)
      },
      {
        label: 'Delete Group',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete Group',
        disabled$: of(false)
      }
    ];

    const table = new Kypo2Table<GroupTableRowAdapter>(
      resources.content.map(group => new Row(group, actions)),
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

  private static mapGroupTableRowToGroupTableModel(groups: TableAdapter<GroupTableRow[]>)
    : TableAdapter<GroupTableRowAdapter[]> {
    const elements: GroupTableRowAdapter[] = [];
    groups.content.forEach( group => {
      elements.push(new GroupTableRowAdapter(group.group));
    });

    return new TableAdapter<GroupTableRowAdapter[]>(elements, groups.pagination);
  }
}

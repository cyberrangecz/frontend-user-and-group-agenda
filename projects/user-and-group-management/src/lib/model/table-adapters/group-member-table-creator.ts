import {PaginatedResource} from './paginated-resource';
import {Column, Kypo2Table, Row} from 'kypo2-table';
import {of} from 'rxjs';
import {User} from 'kypo2-auth';

/**
 * Class creating data source for group members table
 */
export class GroupMemberTableCreator {

  static readonly DELETE_ACTION_ID = 'delete';

  /**
   * Create data source for group members table from paginated users
   * @param resource paginated users to be transformed into table data source
   */
  static create(resource: PaginatedResource<User>): Kypo2Table<User> {
    const actions = [
      {
        id: this.DELETE_ACTION_ID,
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete Member',
        disabled$: of(false)
      }
    ];

    const table = new Kypo2Table<User>(
      resource.elements.map(group => new Row(group, actions)),
      [
        new Column('id', 'id', false),
        new Column('name', 'name', true, 'familyName'),
        new Column('login', 'login', true),
        new Column('issuer', 'issuer', false),
      ]
    );
    table.pagination = resource.pagination;
    table.filterable = true;
    table.filterLabel = 'Filter by surname';
    table.selectable = true;
    return table;
  }
}

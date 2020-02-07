import {PaginatedResource} from './paginated-resource';
import {Column, Kypo2Table, Row} from 'kypo2-table';
import {of} from 'rxjs';
import {User} from 'kypo2-auth';
import {UserTableExpand} from './user-table-expand';
import {UserDetailComponent} from '../../components/user/user-overview/user-detail/user-detail.component';


/**
 * Class creating data source for user table
 */
export class UserTableCreator {
  static readonly DELETE_ACTION_ID = 'delete';

  /**
   * Create data source for users table from paginated users
   * @param resource paginated users to be transformed into table data source
   */
  static create(resource: PaginatedResource<User[]>): Kypo2Table<User> {
    const actions = [
      {
        id: this.DELETE_ACTION_ID,
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete User',
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
        new Column('mail', 'email', false),
      ]
    );
    table.pagination = resource.pagination;
    table.filterable = true;
    table.filterLabel = 'Filter by surname';
    table.selectable = true;
    table.expand = new UserTableExpand(UserDetailComponent);
    return table;
  }
}

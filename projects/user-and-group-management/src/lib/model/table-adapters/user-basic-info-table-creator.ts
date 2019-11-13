import {PaginatedResource} from './paginated-resource';
import {Column, Kypo2Table, Row} from 'kypo2-table';
import {of} from 'rxjs';
import {User} from 'kypo2-auth';

export class UserBasicInfoTableCreator {
  static create(resource: PaginatedResource<User[]>): Kypo2Table<User> {
    const actions = [
      {
        label: 'delete',
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

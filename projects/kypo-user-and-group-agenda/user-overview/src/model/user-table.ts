import { PaginatedResource } from '@sentinel/common';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { Column, SentinelTable, Row } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { UserDetailComponent } from '../components/detail/user-detail.component';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { UserDeleteAction } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserTableExpand } from './user-table-expand';

/**
 * Class creating data source for user table
 */
export class UserTable extends SentinelTable<User> {
  constructor(resource: PaginatedResource<User>, service: UserOverviewService) {
    const rows = resource.elements.map(
      (user) =>
        new Row(user, [
          new UserDeleteAction(
            of(false),
            defer(() => service.delete(user))
          ),
        ])
    );
    const columns = [
      new Column('id', 'id', false),
      new Column('name', 'name', true, 'familyName'),
      new Column('login', 'login', true, 'sub'),
      new Column('issuer', 'issuer', false),
      new Column('mail', 'email', false),
    ];
    super(rows, columns);
    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by surname';
    this.selectable = true;
    this.expand = new UserTableExpand(UserDetailComponent);
  }
}

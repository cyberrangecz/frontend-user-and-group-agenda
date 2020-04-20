import { KypoPaginatedResource } from 'kypo-common';
import { User } from 'kypo-user-and-group-model';
import { Column, Kypo2Table, Row } from 'kypo2-table';
import { defer, of } from 'rxjs';
import { UserDetailComponent } from '../../../../components/user/overview/detail/user-detail.component';
import { UserOverviewService } from '../../../../services/user/user-overview.service';
import { UserDeleteAction } from './user-delete-action';
import { UserTableExpand } from './user-table-expand';

/**
 * Class creating data source for user table
 */
export class UserTable extends Kypo2Table<User> {
  constructor(resource: KypoPaginatedResource<User>, service: UserOverviewService) {
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
      new Column('login', 'login', true),
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

import { PaginatedResource } from '@sentinel/common';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { Column, SentinelTable, Row } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { UserDeleteAction } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserAndGroupNavigator } from '@muni-kypo-crp/user-and-group-agenda';

/**
 * Class creating data source for user table
 */
export class UserTable extends SentinelTable<User> {
  constructor(resource: PaginatedResource<User>, service: UserOverviewService, navigator: UserAndGroupNavigator) {
    const rows = resource.elements.map((element) => UserTable.createRow(element, service, navigator));

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
  }

  private static createRow(user: User, service: UserOverviewService, navigator: UserAndGroupNavigator) {
    const row = new Row(user, [UserTable.createActions(user, service)]);
    row.addLink('name', navigator.toUserDetail(user.id));
    return row;
  }

  private static createActions(user: User, service: UserOverviewService) {
    return new UserDeleteAction(
      of(false),
      defer(() => service.delete(user))
    );
  }
}

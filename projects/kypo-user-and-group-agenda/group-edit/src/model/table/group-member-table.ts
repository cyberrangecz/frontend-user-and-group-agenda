import { PaginatedResource } from '@sentinel/common';
import { User } from 'kypo-user-and-group-model';
import { Column, SentinelTable, Row } from '@sentinel/components/table';
import { defer, of } from 'rxjs';
import { UserAssignService } from '../../services/state/user-assign/user-assign.service';
import { UserDeleteAction } from 'kypo-user-and-group-agenda/internal';

/**
 * Class creating data source for group-overview members table
 */
export class GroupMemberTable extends SentinelTable<User> {
  constructor(resource: PaginatedResource<User>, resourceId: number, service: UserAssignService) {
    const rows = resource.elements.map(
      (user) =>
        new Row(user, [
          new UserDeleteAction(
            of(false),
            defer(() => service.unassign(resourceId, [user]))
          ),
        ])
    );
    const columns = [
      new Column('id', 'id', false),
      new Column('name', 'name', true, 'familyName'),
      new Column('login', 'login', true, 'sub'),
      new Column('issuer', 'issuer', false),
    ];
    super(rows, columns);

    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by surname';
    this.selectable = true;
  }
}

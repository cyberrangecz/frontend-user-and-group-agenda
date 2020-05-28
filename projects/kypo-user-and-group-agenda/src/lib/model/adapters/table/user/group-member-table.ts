import { KypoPaginatedResource } from 'kypo-common';
import { User } from 'kypo-user-and-group-model';
import { Column, Kypo2Table, Row } from 'kypo2-table';
import { defer, of } from 'rxjs';
import { UserAssignService } from '../../../../services/user/user-assign/user-assign.service';
import { UserDeleteAction } from './user-delete-action';

/**
 * Class creating data source for group members table
 */
export class GroupMemberTable extends Kypo2Table<User> {
  constructor(resource: KypoPaginatedResource<User>, resourceId: number, service: UserAssignService) {
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
      new Column('login', 'login', true),
      new Column('issuer', 'issuer', false),
    ];
    super(rows, columns);

    this.pagination = resource.pagination;
    this.filterable = true;
    this.filterLabel = 'Filter by surname';
    this.selectable = true;
  }
}

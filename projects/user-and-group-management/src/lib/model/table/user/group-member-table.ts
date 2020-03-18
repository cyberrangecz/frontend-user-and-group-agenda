import {KypoPaginatedResource} from 'kypo-common';
import {Column, Kypo2Table, Row} from 'kypo2-table';
import {defer, of} from 'rxjs';
import {User} from 'kypo2-auth';
import {UserDeleteAction} from './user-delete-action';
import {Kypo2UserAssignService} from '../../../services/user/kypo2-user-assign.service';

/**
 * Class creating data source for group members table
 */
export class GroupMemberTable extends Kypo2Table<User> {

  constructor(resource: KypoPaginatedResource<User>, resourceId: number, service: Kypo2UserAssignService) {
    const rows = resource.elements
        .map(user => new Row(user, [
          new UserDeleteAction(
            of(false),
            defer(() => service.unassign(resourceId, [user]))
          )
        ]));
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

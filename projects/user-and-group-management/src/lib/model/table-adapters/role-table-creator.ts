import {Column, Kypo2Table, Row} from 'kypo2-table';
import {of} from 'rxjs';
import {UserRole} from 'kypo2-auth';

/**
 * Class creating data source for role table
 */
export class RoleTableCreator {

  static readonly DELETE_ACTION = 'Delete';

  /**
   * Create data source for roles table from roles
   * @param resources roles to be transformed into table data source
   */
  static create(resources: UserRole[]): Kypo2Table<UserRole> {
    const actions = [
      {
        label: this.DELETE_ACTION,
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete Role',
        disabled$: of(false)
      }
    ];

    const table = new Kypo2Table<UserRole>(
      resources.map(role => new Row(role, actions)),
      [
        new Column('id', 'id', false),
        new Column('microserviceId', 'microservice id', false),
        new Column('roleType', 'role type', false),
        new Column('microserviceName', 'microservice name', false),
      ]
    );
    table.selectable = true;
    return table;
  }
}

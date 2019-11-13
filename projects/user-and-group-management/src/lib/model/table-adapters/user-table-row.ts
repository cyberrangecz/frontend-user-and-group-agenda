import {User} from 'kypo2-auth';

/**
 * @deprecated
 */
export class UserTableRow {
  user: User;
  constructor(user: User) {
    this.user = user;
  }
}

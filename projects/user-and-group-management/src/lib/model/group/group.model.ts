import {User, UserRole} from 'kypo2-auth';

export class Group {
  id: number;
  name: string;
  description: string;
  roles: UserRole[];
  members: User[];
  expirationDate: Date;
  canBeDeleted: boolean;

  getExpirationDateUTC(): Date {
    return new Date(Date.UTC(this.expirationDate.getFullYear(), this.expirationDate.getMonth(), this.expirationDate.getDate()));
  }
}


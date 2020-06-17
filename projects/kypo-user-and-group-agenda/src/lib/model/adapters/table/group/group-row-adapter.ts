import { Group } from 'kypo-user-and-group-model';

/**
 * Adapter class for group table
 */
export class GroupRowAdapter extends Group {
  expirationDateFormatted: string;
  rolesCount: number;
  membersCount: number;
}

import { Group } from '@muni-kypo-crp/user-and-group-model';

/**
 * Adapter class for group-overview table
 */
export class GroupRowAdapter extends Group {
  expirationDateFormatted: string;
  rolesCount: number;
  membersCount: number;
}

import {UserRole} from 'kypo2-auth';
import {StringNormalizer} from '../utils/string-normalizer';

export class RoleTableRow {
  role: UserRole;
  normalizedRoleName: string;
  normalizedMicroserviceName: string;

  constructor(role: UserRole) {
    this.role = role;
    this.normalizedRoleName = StringNormalizer.normalizeDiacritics(this.role.roleType).toLowerCase();
    this.normalizedMicroserviceName = StringNormalizer.normalizeDiacritics(this.role.microserviceName).toLowerCase();
  }
}

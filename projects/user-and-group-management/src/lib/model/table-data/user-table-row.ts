import {User} from 'kypo2-auth';
import {StringNormalizer} from '../utils/string-normalizer';

export class UserTableRow {
  user: User;
  normalizedName: string;
  normalizedLogin: string;
  constructor(user: User) {
    this.user = user;
    this.normalizedName = StringNormalizer.normalizeDiacritics(this.user.name).toLowerCase();
    this.normalizedLogin = StringNormalizer.normalizeDiacritics(this.user.login).toLowerCase();
  }
}

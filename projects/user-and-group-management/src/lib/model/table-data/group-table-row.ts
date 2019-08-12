import {Group} from '../group/group.model';
import {StringNormalizer} from '../utils/string-normalizer';

export class GroupTableRow {
  group: Group;
  normalizedName: string;

  constructor(group: Group) {
    this.group = group;
    this.normalizedName = StringNormalizer.normalizeDiacritics(this.group.name).toLowerCase();
  }
}


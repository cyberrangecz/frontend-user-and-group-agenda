import {Filter} from './filter';

export class UserFilter extends Filter {

  constructor(value: string) {
    super('familyName', value);
  }
}

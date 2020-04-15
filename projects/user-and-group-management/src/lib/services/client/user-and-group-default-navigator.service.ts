import {Injectable} from '@angular/core';
import {UserAndGroupNavigator} from './user-and-group-navigator.service';
import {GROUP_EDIT_PATH, GROUP_NEW_PATH, GROUP_PATH, MICROSERVICE_PATH, USER_PATH} from '../../model/client/default-paths';

/**
 *
 */
@Injectable()
export class UserAndGroupDefaultNavigator extends UserAndGroupNavigator {

  toGroupEdit(id: number | string): string {
    return `${GROUP_PATH}/${id}/${GROUP_EDIT_PATH}`;
  }

  toGroupOverview(): string {
    return GROUP_PATH;
  }

  toNewGroup(): string {
    return `${GROUP_PATH}/${GROUP_NEW_PATH}`;
  }

  toNewMicroservice(): string {
    return MICROSERVICE_PATH;
  }

  toUserOverview(): string {
    return USER_PATH;
  }

}

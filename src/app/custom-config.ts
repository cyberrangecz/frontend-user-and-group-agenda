import {environment} from '../environments/environment';
import {UserAndGroupConfig} from '../../projects/user-and-group-management/src/public_api';

/**
 * Example config of user and group library
 */
export const CustomConfig: UserAndGroupConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
  defaultPaginationSize: environment.defaultPaginationSize
};

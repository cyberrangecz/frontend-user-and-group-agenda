import { UserAndGroupConfig } from '../../projects/user-and-group-management/src/public_api';
import { environment } from '../environments/environment';

/**
 * Example config of user and group library
 */
export const CustomConfig: UserAndGroupConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
  defaultPaginationSize: environment.defaultPaginationSize,
};

import {environment} from '../environments/environment';
import {UserAndGroupManagementConfig} from '../../projects/user-and-group-management/src/public_api';

export const CustomConfig: UserAndGroupManagementConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
  defaultPaginationSize: environment.defaultPaginationSize
};

import {environment} from '../environments/environment';
import {UserAndGroupConfig} from '../../projects/user-and-group-management/src/public_api';

export const CustomConfig: UserAndGroupConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
  defaultPaginationSize: environment.defaultPaginationSize
};

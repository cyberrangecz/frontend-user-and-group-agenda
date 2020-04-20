import { KypoUserAndGroupApiConfig } from 'kypo-user-and-group-api';
import { UserAndGroupConfig } from '../../projects/user-and-group-management/src/public_api';
import { environment } from '../environments/environment';

/**
 * Example config of user and group library
 */
export const agendaConfig: UserAndGroupConfig = {
  defaultPaginationSize: environment.defaultPaginationSize,
};

export const apiConfig: KypoUserAndGroupApiConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
};

import { KypoUserAndGroupApiConfig } from 'kypo-user-and-group-api';
import { environment } from '../environments/environment';
import { UserAndGroupAgendaConfig } from '@kypo/user-and-group-agenda';

/**
 * Example config of user and group-overview library
 */
export const agendaConfig: UserAndGroupAgendaConfig = {
  defaultPaginationSize: environment.defaultPaginationSize,
};

export const apiConfig: KypoUserAndGroupApiConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
};

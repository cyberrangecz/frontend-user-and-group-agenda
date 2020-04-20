import { KypoUserAndGroupApiConfig } from 'kypo-user-and-group-api';
import { UserAndGroupAgendaConfig } from '../../projects/kypo-user-and-group-agenda/src/public_api';
import { environment } from '../environments/environment';

/**
 * Example config of user and group library
 */
export const agendaConfig: UserAndGroupAgendaConfig = {
  defaultPaginationSize: environment.defaultPaginationSize,
};

export const apiConfig: KypoUserAndGroupApiConfig = {
  userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
};

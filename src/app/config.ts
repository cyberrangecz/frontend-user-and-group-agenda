import { KypoUserAndGroupApiConfig } from '@cyberrangecz-platform/user-and-group-api';
import { environment } from '../environments/environment';
import { UserAndGroupAgendaConfig } from '@cyberrangecz-platform/user-and-group-agenda';

/**
 * Example config of user and group-overview library
 */
export const agendaConfig: UserAndGroupAgendaConfig = {
    defaultPaginationSize: environment.defaultPaginationSize,
};

export const apiConfig: KypoUserAndGroupApiConfig = {
    userAndGroupRestBasePath: environment.userAndGroupRestBasePath,
};

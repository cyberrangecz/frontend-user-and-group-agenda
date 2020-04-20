import { Injectable } from '@angular/core';
import { UserAndGroupAgendaConfig } from '../../model/client/user-and-group-agenda-config';

/**
 * Config service holding and providing user and group config
 */
@Injectable()
export class UserAndGroupContext {
  private readonly _config: UserAndGroupAgendaConfig;

  get config(): UserAndGroupAgendaConfig {
    return this._config;
  }

  constructor(config: UserAndGroupAgendaConfig) {
    this._config = config;
  }
}

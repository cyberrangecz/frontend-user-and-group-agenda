import { Injectable } from '@angular/core';
import { UserAndGroupAgendaConfig } from '@kypo/user-and-group-agenda';

/**
 * Config service holding and providing user and group-overview config
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

import {Injectable} from '@angular/core';
import {UserAndGroupConfig} from './user-and-group-config';

/**
 * Config service holding and providing user and group config
 */
@Injectable()
export class ConfigService {
  private readonly _config: UserAndGroupConfig;

  get config(): UserAndGroupConfig {
    return this._config;
  }

  constructor(config: UserAndGroupConfig) {
    this._config = config;
  }
}

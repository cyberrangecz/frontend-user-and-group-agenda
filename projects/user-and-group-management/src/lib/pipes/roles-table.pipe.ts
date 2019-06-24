import {Pipe, PipeTransform} from '@angular/core';
import {Role} from '../model/role/role.model';

@Pipe({name: 'rolesToString'})
export class RolesTablePipe implements  PipeTransform {

  transform(roles: Role[]): string {
    return roles && roles.length > 0
      ? this.createRolesCountText(roles)
      : '-';
  }

  private createRolesCountText(roles: Role[]): string {
    return roles.length === 1
    ? '1 role'
    : roles.length + ' roles';
  }
}

import {Pipe, PipeTransform} from '@angular/core';
import {UserRole} from 'kypo2-auth';

@Pipe({name: 'rolesToString'})
export class RolesTablePipe implements  PipeTransform {

  transform(roles: UserRole[]): string {
    return roles && roles.length > 0
      ? this.createRolesCountText(roles)
      : '-';
  }

  private createRolesCountText(roles: UserRole[]): string {
    return roles.length === 1
    ? '1 role'
    : roles.length + ' roles';
  }
}

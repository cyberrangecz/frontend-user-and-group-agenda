import {Pipe, PipeTransform} from '@angular/core';
import {Role} from '../model/role/role.model';

@Pipe({name: 'rolesToString'})
export class RolesTablePipe implements  PipeTransform {

  transform(value: Role[]): string {
    return value && value.length > 0
      ? value.map(role => role.name).join(', ')
      : '-';
  }
}

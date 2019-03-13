import {Pipe, PipeTransform} from '@angular/core';
import {Group} from '../model/group/group.model';

@Pipe({name: 'groupsToString'})
export class GroupsTablePipe implements PipeTransform {

  transform(value: Group[]): string {
    return value && value.length > 0
      ? value.map(group => group.name).join(', ')
      : '-';
  }
}

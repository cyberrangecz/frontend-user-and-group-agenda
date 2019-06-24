import {Pipe} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({name: 'dateFormat'})
export class DateFormatterPipe extends DatePipe {
  transform(value: any, args?: any): any {
    if (value) {
      return super.transform(value, 'dd MMM yyyy');
    } else {
      return '-';
    }
  }
}

import {Type} from '@angular/core';

export class UserTableExpand {
  component: Type<any>;
  config: any;


  constructor(component: Type<any>, config?: any) {
    this.component = component;
    this.config = config;
  }
}

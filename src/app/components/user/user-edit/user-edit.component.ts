import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../../model/user/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnChanges {

  @Input() user: User;

  name: string;
  login: string;
  mail: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('user' in changes) {
      this.resolveInitialValues();
    }
  }

  private resolveInitialValues() {
    if (this.user) {
      this.setValuesFromUser();
    }
  }

  private setValuesFromUser() {
    this.name = this.user.name;
    this.login = this.user.login;
    this.mail = this.user.mail;
  }
}

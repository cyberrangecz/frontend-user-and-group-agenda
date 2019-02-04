import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {User} from '../../../../model/user/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './add-to-group-user-table.component.html',
  styleUrls: ['./add-to-group-user-table.component.css']
})
export class AddToGroupUserTableComponent implements OnInit, OnChanges {

  @Input() selectedUsers: User[];
  @Output() userSelectionChange: EventEmitter<User[]> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}

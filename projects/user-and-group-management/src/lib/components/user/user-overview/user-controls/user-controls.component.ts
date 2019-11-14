import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from '../../../../model/base-component';

@Component({
  selector: 'kypo2-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserControlsComponent extends  BaseComponent implements OnInit {

  @Input() selectedUsersCount: number;
  @Output() deleteSelected = new EventEmitter();

  ngOnInit() {
  }

  deleteUsers() {
    this.deleteSelected.emit();
  }
}

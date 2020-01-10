import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from '../../../../model/base-component';

/**
 * User controls for user overview component
 */
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

  /**
   * Emits event to delete selected users
   */
  deleteUsers() {
    this.deleteSelected.emit();
  }
}

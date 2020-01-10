import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Component containing controls for group overview component
 */
@Component({
  selector: 'kypo2-group-controls',
  templateUrl: './group-controls.component.html',
  styleUrls: ['./group-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupControlsComponent implements OnInit {

  /**
   * Number of selected groups
   */
  @Input() selectedGroupsCount: number;

  /**
   * Event emitter to create new group
   */
  @Output() createNewGroup = new EventEmitter();

  /**
   * Event emitter to delete selected groups
   */
  @Output() deleteSelected = new EventEmitter();

  ngOnInit(): void {
  }

  /**
   * Emits event to create new group
   */
  createGroup() {
    this.createNewGroup.emit();
  }

  /**
   * Emits event to delete selected groups
   */
  deleteGroups() {
    this.deleteSelected.emit();
  }
}

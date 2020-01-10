import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Controls for group edit component
 */
@Component({
  selector: 'kypo2-group-edit-controls',
  templateUrl: './group-edit-controls.component.html',
  styleUrls: ['./group-edit-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditControlsComponent implements OnInit {

  /**
   * True if existing group is being edited, false if new is being created
   */
  @Input() editMode: boolean;

  /**
   * True if controls are disabled, false otherwise
   */
  @Input() disabled: boolean;

  /**
   * Event emitter for save event
   */
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Emits event to save the edited group
   */
  onSave() {
    this.save.emit(false);
  }
}

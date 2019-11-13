import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kypo2-group-edit-controls',
  templateUrl: './group-edit-controls.component.html',
  styleUrls: ['./group-edit-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditControlsComponent implements OnInit {

  @Input() editMode: boolean;
  @Input() disabled: boolean;
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSave() {
    this.save.emit(false);
  }
}

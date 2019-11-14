import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kypo2-group-controls',
  templateUrl: './group-controls.component.html',
  styleUrls: ['./group-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupControlsComponent implements OnInit {

  @Input() selectedGroupsCount: number;
  @Output() createNewGroup = new EventEmitter();
  @Output() deleteSelected = new EventEmitter();

  ngOnInit(): void {
  }

  createGroup() {
    this.createNewGroup.emit();
  }

  deleteGroups() {
    this.deleteSelected.emit();
  }
}

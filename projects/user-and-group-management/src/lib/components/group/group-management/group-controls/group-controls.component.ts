import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {GroupSelectionService} from '../../../../services/facade/group/group-selection.service';
import {GroupEditComponent} from '../../group-edit/group-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';

@Component({
  selector: 'kypo2-group-controls',
  templateUrl: './group-controls.component.html',
  styleUrls: ['./group-controls.component.css']
})
export class GroupControlsComponent implements OnInit, OnDestroy {

  private _selectedGroupsSubscription: Subscription;

  @Input() selectedGroups: number;
  @Output() createNewGroup = new EventEmitter();
  @Output() deleteSelected = new EventEmitter();

  constructor(public dialog: MatDialog,
              private groupManagementService: GroupSelectionService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._selectedGroupsSubscription) {
      this._selectedGroupsSubscription.unsubscribe();
    }
  }

  createGroup() {
    this.openCreateGroupPopup();
  }

  deleteGroups() {
    this.deleteSelected.emit();
  }

  private openCreateGroupPopup() {
    this.dialog.open(GroupEditComponent, { data: null })
      .afterClosed()
      .subscribe(result => {
        if ((result !== undefined || result !== null) && result === DialogResultEnum.SUCCESS) {
          this.groupManagementService.emitDataChange();
        }
      });
  }
}

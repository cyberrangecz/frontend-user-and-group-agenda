import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {GroupSelectionService} from '../../../../services/group/group-selection.service';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/alert/kypo2-user-and-group-notification.service';
import {Notification} from '../../../../model/alert/alert.model';
import {NotificationType} from '../../../../model/enums/alert-type.enum';
import {GroupEditComponent} from '../../group-edit/group-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {ErrorHandlerService} from '../../../../services/alert/error-handler.service';

@Component({
  selector: 'kypo2-group-controls',
  templateUrl: './group-controls.component.html',
  styleUrls: ['./group-controls.component.css']
})
export class GroupControlsComponent implements OnInit, OnDestroy {

  private _selectedGroupsSubscription: Subscription;
  selectedGroupsCount = 0;

  constructor(public dialog: MatDialog,
              private groupManagementService: GroupSelectionService,
              private groupFacade: GroupFacadeService,
              private errorHandler: ErrorHandlerService,
              private alertService: Kypo2UserAndGroupNotificationService) {

  }

  ngOnInit() {
    this.subscribeSelectedGroups();
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
    this.sendDeleteGroupsRequest();
  }

  private getSelectedGroupIds(): number[] {
    return this.groupManagementService.getSelectedGroups()
      .map(group => group.id);
  }

  private sendDeleteGroupsRequest() {
    this.groupFacade.deleteGroups(this.getSelectedGroupIds())
      .subscribe(
        resp => {
          this.groupManagementService.emitDataChange();
          this.alertService.addNotification(new Notification(NotificationType.SUCCESS, 'Selected groups were successfully deleted'));
        },
        err => {
          this.errorHandler.displayInAlert(err, 'Deleting groups');
        }
      );
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

  private subscribeSelectedGroups() {
    this._selectedGroupsSubscription = this.groupManagementService.selectionChange$
      .subscribe(size =>
        this.selectedGroupsCount = size);
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {GroupSelectionService} from '../../../../services/facade/group/group-selection.service';
import {GroupFacadeService} from '../../../../services/facade/group/group-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupNotification} from '../../../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../../model/enums/alert-type.enum';
import {GroupEditComponent} from '../../group-edit/group-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {Kypo2UserAndGroupErrorService} from '../../../../services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupError} from '../../../../model/events/kypo2-user-and-group-error';

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
              private errorHandler: Kypo2UserAndGroupErrorService,
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
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Selected groups were successfully deleted'));
        },
        err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting groups'));
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

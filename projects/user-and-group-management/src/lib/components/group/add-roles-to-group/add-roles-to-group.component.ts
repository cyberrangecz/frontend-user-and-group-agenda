import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../model/group/group.model';
import {GroupFacadeService} from '../../../services/facade/group/group-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../services/notification/kypo2-user-and-group-notification.service';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {Kypo2UserAndGroupNotification} from '../../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../model/enums/alert-type.enum';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {RoleFacadeService} from '../../../services/facade/role/role-facade.service';
import {UserRole} from 'kypo2-auth';

@Component({
  selector: 'kypo2-add-roles-to-group',
  templateUrl: './add-roles-to-group.component.html',
  styleUrls: ['./add-roles-to-group.component.css']
})
export class AddRolesToGroupComponent implements OnInit {

  selectedRoles: UserRole[];
  availableRoles$: Observable<UserRole[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
              public dialogRef: MatDialogRef<AddRolesToGroupComponent>,
              private roleFacadeService: RoleFacadeService,
              private groupFacadeService: GroupFacadeService,
              private alertService: Kypo2UserAndGroupNotificationService) {
  }

  ngOnInit() {
    this.getAvailableRoles();
  }

  cancel() {
    this.dialogRef.close({
      status: DialogResultEnum.CANCELED,
      failedCount: 0,
      totalCount: 0
    });
  }

  save() {
    if (this.isValidInput()) {
      this.sendAddRolesToGroupRequests();
    }
  }

  onRoleSelectionChanged(roles: UserRole[]) {
    this.selectedRoles = roles;
  }

  private isValidInput(): boolean {
    const potentialErrorMessage = this.validateInput();
    if (potentialErrorMessage !== '') {
      this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.ERROR, potentialErrorMessage));
      return false;
    }
    return true;
  }

  private validateInput(): string {
    let errorMessage = '';
    if (!this.selectedRoles || this.selectedRoles.length <= 0) {
      errorMessage += 'Roles cannot be empty';
    }
    return errorMessage;
}

  private sendAddRolesToGroupRequests() {
    forkJoin(this.selectedRoles.map(role =>
      this.sendAddRoleToGroupRequest(role)))
      .subscribe(
        results => {
          const failedRequests = results.filter(result => result === 'failed');
          this.closeDialogAfterAllRequestsFinished(failedRequests, results.length);
        }
      );
  }

  private sendAddRoleToGroupRequest(role: UserRole): Observable<any> {
    return this.groupFacadeService.assignRoleToGroup(this.group.id, role.id)
      .pipe(map(
        resp => resp),
        catchError(error => of('failed'))
      );
  }

  private closeDialogAfterAllRequestsFinished(failedRequests, totalCount: number) {
    if (failedRequests.length > 0) {
      this.dialogRef.close({
        status: DialogResultEnum.FAILED,
        failedCount: failedRequests.length,
        totalCount: totalCount
      });
    } else {
      this.dialogRef.close({
        status: DialogResultEnum.SUCCESS,
        failedCount: 0,
        totalCount: totalCount
      });
    }
  }

  private getAvailableRoles() {
    this.availableRoles$ = this.roleFacadeService.getRoles()
      .pipe(map(roles => {
       return roles.filter(role =>
         !this.group.roles.some(assignedRole =>
           assignedRole.id === role.id));
      }));
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../model/group/group.model';
import {GroupFacadeService} from '../../../services/group/group-facade.service';
import {AlertService} from '../../../services/alert/alert.service';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {Role} from '../../../model/role.model';
import {Alert} from '../../../model/alert/alert.model';
import {AlertType} from '../../../model/enums/alert-type.enum';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Component({
  selector: 'app-add-roles-to-group',
  templateUrl: './add-roles-to-group.component.html',
  styleUrls: ['./add-roles-to-group.component.css']
})
export class AddRolesToGroupComponent implements OnInit {

  selectedRoles: Role[];

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
              public dialogRef: MatDialogRef<AddRolesToGroupComponent>,
              private groupFacadeService: GroupFacadeService,
              private alertService: AlertService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }

  save() {
    if (this.isValidInput()) {
      this.sendAddRolesToGroupRequests();
    }
  }

  onRoleSelectionChanges($event: Role[]) {
    this.selectedRoles = $event;
  }

  private isValidInput(): boolean {
    const potentionalErrorMessage = this.validateInput();
    if (potentionalErrorMessage !== '') {
      this.alertService.addAlert(new Alert(AlertType.ERROR, potentionalErrorMessage));
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
          const failedRequests = results.filter(result => result === null);
          this.closeDialogAfterAllRequestsFinished(failedRequests, results.length);
        }
      );
  }

  private sendAddRoleToGroupRequest(role: Role): Observable<any> {
    return this.groupFacadeService.assignRoleToGroupInMicroservice(this.group.id, role.id, 0)
      .pipe(map(
        resp => resp,
        catchError(error => of(null)))
      );
    // TODO Add microserviceID
  }

  closeDialogAfterAllRequestsFinished(failedRequests, totalCount: number) {
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
}

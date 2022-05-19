import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SentinelBaseDirective } from '@sentinel/common';
import { Observable } from 'rxjs';
import { FileUploadProgressService } from '../../services/file-upload/file-upload-progress.service';

/**
 * Component of users upload dialog window
 */
@Component({
  selector: 'kypo-users-upload-dialog',
  templateUrl: './users-upload-dialog.component.html',
  styleUrls: ['./users-upload-dialog.component.css'],
})
export class UsersUploadDialogComponent extends SentinelBaseDirective {
  selectedFile: File;
  uploadInProgress$: Observable<boolean>;
  onUpload$ = new EventEmitter<File>();

  constructor(
    public dialogRef: MatDialogRef<UsersUploadDialogComponent>,
    private uploadProgressService: FileUploadProgressService
  ) {
    super();
    this.uploadInProgress$ = this.uploadProgressService.isInProgress$;
  }

  /**
   * Cancels the upload and closes the dialog window with no result
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Emits upload event with selected file
   */
  upload(): void {
    this.onUpload$.emit(this.selectedFile);
  }

  /**
   * Removes selected file
   */
  clearFile(): void {
    this.selectedFile = null;
  }
}

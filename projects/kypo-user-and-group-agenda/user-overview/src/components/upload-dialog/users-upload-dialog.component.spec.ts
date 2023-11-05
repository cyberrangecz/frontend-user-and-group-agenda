import { ngfModule } from 'angular-file';
import { UsersUploadDialogComponent } from './users-upload-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SentinelPipesModule } from '@sentinel/common/pipes';
import {
  createDialogRefSpy,
  createFileUploadProgressServiceSpy,
} from '../../../../internal/src/testing/testing-commons.spec';
import { FileUploadProgressService } from '../../services/file-upload/file-upload-progress.service';
import { asyncData } from '@sentinel/common/testing';

describe('UsersUploadDialogComponent', () => {
  let component: UsersUploadDialogComponent;
  let fixture: ComponentFixture<UsersUploadDialogComponent>;

  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UsersUploadDialogComponent>>;
  let uploadProgressService: jasmine.SpyObj<FileUploadProgressService>;

  beforeEach(async(() => {
    matDialogRefSpy = createDialogRefSpy();
    uploadProgressService = createFileUploadProgressServiceSpy();
    uploadProgressService.isInProgress$ = asyncData(false);
    TestBed.configureTestingModule({
      imports: [SentinelPipesModule, BrowserAnimationsModule, ngfModule],
      declarations: [UsersUploadDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: FileUploadProgressService, useValue: uploadProgressService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with no result', () => {
    component.cancel();
    expect(matDialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should emit upload event', () => {
    spyOn(component.onUpload$, 'emit');
    component.upload();
    expect(component.onUpload$.emit).toHaveBeenCalledTimes(1);
  });

  it('should clear file', () => {
    component.selectedFile = new File([], '');
    component.clearFile();
    expect(component.selectedFile).toBeFalsy();
  });
});

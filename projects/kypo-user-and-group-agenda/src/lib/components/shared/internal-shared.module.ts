import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CsirtMuConfirmationDialogModule } from 'csirt-mu-common';
import { UserAndGroupContext } from '../../services/shared/user-and-group-context.service';

/**
 * Module containing internally shared (within library) components and providers
 */
@NgModule({
  imports: [CommonModule, CsirtMuConfirmationDialogModule],
  providers: [UserAndGroupContext],
})
export class InternalSharedModule {}

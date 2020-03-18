import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfigService} from '../../config/config.service';
import {CsirtMuConfirmationDialogModule} from 'csirt-mu-common';

/**
 * Module containing internally shared (within library) components and providers
 */
@NgModule({
  imports: [
    CommonModule,
    CsirtMuConfirmationDialogModule,
  ],
  providers: [
    ConfigService
  ],
})
export class InternalSharedModule { }

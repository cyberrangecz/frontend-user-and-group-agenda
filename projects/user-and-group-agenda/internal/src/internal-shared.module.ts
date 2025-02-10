import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAndGroupContext } from './services/user-and-group-context.service';

/**
 * Module containing internally shared (within library) components and providers
 */
@NgModule({
  imports: [CommonModule],
  providers: [UserAndGroupContext],
})
export class InternalSharedModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsTablePipe} from './groups-table.pipe';
import {RolesTablePipe} from './roles-table.pipe';

@NgModule({
  declarations: [
    GroupsTablePipe,
    RolesTablePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupsTablePipe,
    RolesTablePipe
  ]
})
export class PipesModule {

}

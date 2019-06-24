import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsTablePipe} from './groups-table.pipe';
import {RolesTablePipe} from './roles-table.pipe';
import {DateFormatterPipe} from './date-formatter.pipe';

@NgModule({
  declarations: [
    GroupsTablePipe,
    RolesTablePipe,
    DateFormatterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupsTablePipe,
    RolesTablePipe,
    DateFormatterPipe
  ]
})
export class PipesModule {

}

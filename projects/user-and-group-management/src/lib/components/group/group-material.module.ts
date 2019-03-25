import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule
  ]
})
export class GroupMaterialModule {

}

import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule, MatDividerModule, MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule, MatTooltipModule
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
    MatDividerModule
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
    MatDividerModule
  ]
})
export class GroupMaterialModule {

}

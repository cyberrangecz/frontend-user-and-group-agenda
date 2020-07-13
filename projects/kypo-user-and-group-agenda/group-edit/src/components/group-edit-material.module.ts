import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * Material components imports for group-overview state module
 */
@NgModule({
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
  exports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
})
export class GroupEditMaterialModule {}

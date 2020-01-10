import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';
import {MatCardModule} from '@angular/material/card';

/**
 * Material component imports for microservice edit module
 */
@NgModule({
  imports: [
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule
  ]
})
export class Kypo2MicroserviceEditMaterialModule {
}

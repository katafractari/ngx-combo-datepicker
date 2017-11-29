import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboDatepickerComponent } from './combo-datepicker.component';
import { FormsModule } from '@angular/forms';
import { AttributesDirective } from './custom-attributes.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ComboDatepickerComponent,
    AttributesDirective,
    // DateAttributesDirective,
  ],
  exports: [
    ComboDatepickerComponent
  ]
})
export class ComboDatepickerModule {}

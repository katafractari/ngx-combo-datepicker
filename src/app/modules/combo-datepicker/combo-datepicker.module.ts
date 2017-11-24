import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboDatepickerComponent } from './combo-datepicker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ComboDatepickerComponent
  ],
  exports: [
    ComboDatepickerComponent
  ]
})
export class ComboDatepickerModule {}

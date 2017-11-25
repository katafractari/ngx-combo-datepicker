import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';
import { Selects } from './models';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ComboDatepickerComponent),
  multi: true
};

export const DEFAULT_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ComboDatepickerComponent),
  multi: true,
};

@Component({
  selector: 'ngx-combo-datepicker',
  templateUrl: './combo-datepicker.component.html',
  providers: [
    DEFAULT_VALUE_ACCESSOR,
    DEFAULT_VALIDATOR
  ]
})
export class ComboDatepickerComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
  @Input() ngModel;
  @Input() date;
  @Input() minDate;
  @Input() maxDate;
  @Input() months;
  @Input() order;
  @Input() attrsDate: object = {};
  @Input() attrsMonth: object = {};
  @Input() attrsYear: object = {};
  @Input() yearOrder;
  @Input() timezone;
  @Input() placeholder;
  @Input() ngRequired;
  @Input() showDays = true;

  private selects: Selects = {
    d: { show: true },
    m: { show: true },
    y: { show: true }
  };

  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private _minDate: Date;
  private _maxDate: Date;
  private placeHolders: any;

  ngOnInit() {
    // Initialize model.
    this.ngModel = this.parseDate(this.ngModel, this.timezone);

    // Initialize attributes variables.
    this.selects.d.attrs = this.attrsDate;
    this.selects.m.attrs = this.attrsMonth;
    this.selects.y.attrs = this.attrsYear;

    // Verify if initial date was defined.
    const initDate = this.parseDate(this.date, this.timezone);
    if (initDate != null) {
      this.ngModel = initDate;
    }

    // Initialize order.
    if (typeof this.order !== 'string') {
      this.order = 'dmy'.split('');
    } else {
      this.order = this.order.toLowerCase().split('');
    }

    // Initialize minimal and maximum values.
    this._minDate = this.parseDate(this.minDate, this.timezone);
    if (this.minDate == null) {
      const now = new Date();
      this._minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate(),
        now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
    this._maxDate = this.parseDate(this.maxDate, this.timezone);
    if (this._maxDate == null) {
      this._maxDate = new Date();
    }

    // Verify if selected date is in the valid range.
    if (this.ngModel && this.ngModel < this._minDate) {
      this.ngModel = this._minDate;
    }
    if (this.ngModel && this.ngModel > this._maxDate) {
      this.ngModel = this._maxDate;
    }

    if (this.months !== undefined && this.months !== null) {
      if (typeof this.months === 'string') {
        const months = this.months.split(',');
        if (months.length === 12) {
          this.monthNames = months;
        }
      }
      if (Array.isArray(this.months) && this.months.length === 12) {
        this.monthNames = this.months;
      }
    }

    this.updatePlaceholders();
    this.updateMonthList('');
    this.updateYearList('');
    this.updateDateList('', '');
    this.writeValue(this.ngModel);
  }

  onChange(event) {
    let res = null;

    // Check that the three combo boxes have values.
    if (this.selects.d.value && !isNaN(this.selects.m.value) &&
      this.selects.y.value != null && this.selects.y.value) {
      const maxDay = this.getMaxDate(this.selects.m.value + 1, this.selects.m.value);

      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      let milliseconds = 0;
      if (this.ngModel != null) {
        hours = this.ngModel.getHours();
        minutes = this.ngModel.getMinutes();
        seconds = this.ngModel.getSeconds();
        milliseconds = this.ngModel.getMilliseconds();
      }

      res = new Date(this.selects.y.value, this.selects.m.value,
        this.selects.d.value > maxDay ? maxDay : this.selects.d.value, hours, minutes, seconds, milliseconds);
    }

    // Disable placeholders after selecting a value.
    if (this.placeHolders) {
      if (this.selects.y.value) {
        this.placeHolders[0].disabled = true;
      }
      if (this.selects.d.value) {
        this.placeHolders[1].disabled = true;
      }
      if (this.selects.d.value) {
        this.placeHolders[2].disabled = true;
      }
    }

    // Hide or show days and months according to the min and max dates.
    this.updateMonthList(this.selects.y.value);
    this.updateYearList(this.selects.d.value);
    this.updateDateList(this.selects.d.value, this.selects.y.value);

    this.propagateChange(res);
  }

  propagateChange: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selects.d.value = value.getDate();
      this.selects.m.value = value.getMonth();
      this.selects.y.value = value.getFullYear();
    } else {
      this.selects.d.value = this.showDays ? null : 1;
      this.selects.m.value = null;
      this.selects.y.value = null;

      if (this.placeHolders) {
        this.placeHolders[0].disabled = false;
        this.placeHolders[1].disabled = false;
        this.placeHolders[2].disabled = false;
      }
    }

    this.updateMonthList(this.selects.y.value);
    this.updateYearList(this.selects.m.value);
    this.updateDateList(this.selects.m.value, this.selects.y.value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    return this.selects.d.value && this.selects.d.value && this.selects.y.value ?
      null : { required: true };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.placeholder && !changes.placeholder.isFirstChange()) {
      this.updatePlaceholders();
      this.updateMonthList(this.selects.y.value);
      this.updateYearList(this.selects.d.value);
      this.updateDateList(this.selects.d.value, this.selects.y.value);
    }
  }

  // Update list of months.
  updateMonthList(year) {
    // Parse parameter.
    year = this.parseIntStrict(year);

    // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
    const start = year !== null && year === this._minDate.getFullYear() ? this._minDate.getMonth() : 0;
    const end = year !== null && year === this._maxDate.getFullYear() ? this._maxDate.getMonth() : 11;

    // Generate list.
    this.selects.m.options = [];
    if (this.placeHolders) {
      this.selects.m.options.push(this.placeHolders[1]);
    }
    for (let i = start; i <= end; i++) {
      this.selects.m.options.push({value: i, name: this.monthNames[i]});
    }
  }

  // Update list of years.
  updateYearList(month?) {
    // Parse parameter.
    month = this.parseIntStrict(month);

    this.selects.y.options = [];
    const isReverse = typeof this.yearOrder === 'string' && this.yearOrder.indexOf('des') === 0;
    for (let i = this._minDate.getFullYear(); i <= this._maxDate.getFullYear(); i++) {
      const now = new Date();
      if (month + 1 < this._minDate.getMonth() && now.getFullYear() === i && month !== null &&
        (isReverse && month > now.getMonth() || !isReverse && month < now.getMonth())) {
        continue;
      }

      this.selects.y.options.push({value: i, name: i});
    }

    // Verify if the order of the years must be reversed.
    if (isReverse) {
      this.selects.y.options.reverse();
    }

    // Prepend the years placeholder
    if (this.placeHolders) {
      this.selects.y.options.unshift(this.placeHolders[0]);
    }
  }

  // Initialize list of days.
  updateDateList(month, year) {
    // Parse parameters.
    month = this.parseIntStrict(month);
    year = this.parseIntStrict(year);

    // Start date is 1, unless the selected month and year matchs the minimum date.
    let start = 1;
    if (month !== null && month === this._minDate.getMonth() &&
      year !== null && year === this._minDate.getFullYear()) {
      start = this._minDate.getDate();
    }

    // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
    let end = this.getMaxDate(month !== null ? (month + 1) : null, year);
    if (month !== null && month === this._maxDate.getMonth() &&
      year !== null && year === this._maxDate.getFullYear()) {
      end = this._maxDate.getDate();
    }

    // Generate list.
    this.selects.d.options = [];
    if (this.placeHolders) {
      this.selects.d.options.push(this.placeHolders[2]);
    }
    for (let i = start; i <= end; i++) {
      this.selects.d.options.push({
        value: i,
        name: i
      });
    }
  }

  // Initialize place holders.
  updatePlaceholders() {
    this.placeHolders = null;
    if (this.placeholder !== undefined && this.placeholder !== null &&
      (typeof this.placeholder === 'string' || Array.isArray(this.placeholder))) {

      const holders = typeof this.placeholder === 'string' ?
        this.placeholder.split(',') : this.placeholder;
      if (holders.length === 3) {
        this.placeHolders = [];
        for (const h of holders) {
          this.placeHolders.push({value: '', name: h, disabled: false});
        }
      }
    }
  }

  // Define function for parse dates.
  parseDate(myDate, myTimezone) {
    let res = null;
    if (myDate !== undefined && myDate !== null) {
      if (myDate instanceof Date) {
        res = myDate;
      } else {
        if (typeof myDate === 'number' || typeof myDate === 'string') {
          // Parse date.
          if (typeof myDate === 'number') {
            res = new Date(parseInt(myDate.toString(), 10));
          } else {
            res = new Date(myDate);
          }

          // Adjust timezone.
          res = this.adjustTimezone(res, myTimezone);
        }
      }
    }
    return res;
  }

  // Define function for adjust timezone.
  adjustTimezone(myDate, myTimezone) {
    const offset = isNaN(myTimezone) ? new Date().getTimezoneOffset() : parseFloat(myTimezone) * 60;
    return new Date(myDate.getTime() + offset * 60 * 1000);
  }

  // Function to parse an string returning either a number or 'null' (instead of NaN).
  parseIntStrict(num) {
    return (num !== null && num !== '' && isNaN(parseInt(num, 10))) ? parseInt(num, 10) : null;
  }

  // Define fuction for getting the maximum date for a month.
  getMaxDate(month, year) {
    let res = 31;
    if (month != null) {
      if (month === 4 || month === 6 || month === 9 || month === 11) {
        res = 30;
      }
      if (year !== null && month === 2) {
        res = year % 4 === 0 && year % 100 !== 0 ? 29 : 28;
      }
    }
    return res;
  }
}

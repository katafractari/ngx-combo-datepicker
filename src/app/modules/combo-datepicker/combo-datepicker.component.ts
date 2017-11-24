import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';

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
  @Input() ngDate;
  @Input() minDate;
  @Input() maxDate;
  @Input() months;
  @Input() ngOrder;
  @Input() ngAttrsDate;
  @Input() ngAttrsMonth;
  @Input() ngAttrsYear;
  @Input() yearOrder;
  @Input() ngTimezone;
  @Input() placeholder;
  @Input() ngRequired;
  @Input() showDays = true;

  private selectedDate: string = '';
  private selectedMonth: string = '';
  private selectedYear: string = '';

  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private _minDate: Date;
  private _maxDate: Date;
  private placeHolders: any;
  _months: any;
  _years: any;
  _dates: any;

  ngOnInit() {
    // Initialize model.
    this.ngModel = this.parseDate(this.ngModel, this.ngTimezone);

    // Initialize attributes variables.
    this.ngAttrsDate = this.parseJsonPlus(this.ngAttrsDate);
    this.ngAttrsMonth = this.parseJsonPlus(this.ngAttrsMonth);
    this.ngAttrsYear = this.parseJsonPlus(this.ngAttrsYear);

    // Verify if initial date was defined.
    let initDate = this.parseDate(this.ngDate, this.ngTimezone);
    if (initDate != null) {
      this.ngModel = initDate;
    }

    // Initialize order.
    if (typeof this.ngOrder !== 'string') {
      this.ngOrder = 'dmy';
    } else {
      this.ngOrder = this.ngOrder.toLowerCase();
    }

    // Initialize minimal and maximum values.
    this._minDate = this.parseDate(this.minDate, this.ngTimezone);
    if (this.minDate == null) {
      let now = new Date();
      this._minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate(),
        now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
    this._maxDate = this.parseDate(this.maxDate, this.ngTimezone);
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
        let months = this.months.split(',');
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
  }

  onChange(event) {
    let res = null;

    // Check that the three combo boxes have values.
    if (this.selectedDate != null && this.selectedDate !== '' && !isNaN(parseInt(this.selectedMonth, 10)) &&
      this.selectedYear != null && this.selectedYear !== '') {
      const maxDay = this.getMaxDate(this.selectedMonth + 1, this.selectedYear);

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

      res = new Date(parseInt(this.selectedYear, 10), parseInt(this.selectedMonth, 10),
        parseInt(this.selectedDate, 10) > maxDay ? maxDay : parseInt(this.selectedDate, 10), hours, minutes, seconds,
        milliseconds);
    }

    // Disable placeholders after selecting a value.
    if (this.placeHolders) {
      if (this.selectedYear !== '') {
        this.placeHolders[0].disabled = true;
      }
      if (this.selectedMonth !== '') {
        this.placeHolders[1].disabled = true;
      }
      if (this.selectedDate !== '') {
        this.placeHolders[2].disabled = true;
      }
    }

    // Hide or show days and months according to the min and max dates.
    this.updateMonthList(this.selectedYear);
    this.updateYearList(this.selectedMonth);
    this.updateDateList(this.selectedMonth, this.selectedYear);

    this.propagateChange(res);
  }

  propagateChange: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selectedDate = value.getDate();
      this.selectedMonth = value.getMonth();
      this.selectedYear = value.getFullYear();
    } else {
      this.selectedDate = this.showDays ? '' : '1';
      this.selectedMonth = '';
      this.selectedYear = '';

      if (this.placeHolders) {
        this.placeHolders[0].disabled = false;
        this.placeHolders[1].disabled = false;
        this.placeHolders[2].disabled = false;
      }
    }

    this.updateMonthList(this.selectedYear);
    this.updateYearList(this.selectedMonth);
    this.updateDateList(this.selectedMonth, this.selectedYear);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    return this.selectedDate && this.selectedMonth && this.selectedYear ?
      null : { required: true };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.placeholder && !changes.placeholder.isFirstChange()) {
      this.updatePlaceholders();
      this.updateMonthList(this.selectedYear);
      this.updateYearList(this.selectedMonth);
      this.updateDateList(this.selectedMonth, this.selectedYear);
    }
  }

  // Update list of months.
  updateMonthList(year) {
    // Parse parameter.
    year = this.parseIntStrict(year);

    // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
    let start = year !== null && year === this._minDate.getFullYear() ? this._minDate.getMonth() : 0;
    let end = year !== null && year === this._maxDate.getFullYear() ? this._maxDate.getMonth() : 11;

    // Generate list.
    this._months = [];
    if (this.placeHolders) {
      this._months.push(this.placeHolders[1]);
    }
    for (let i = start; i <= end; i++) {
      this._months.push({value: i, name: this.monthNames[i]});
    }
  }

  // Update list of years.
  updateYearList(month?) {
    // Parse parameter.
    month = this.parseIntStrict(month);

    this._years = [];
    let isReverse = typeof this.yearOrder === 'string' && this.yearOrder.indexOf('des') === 0;
    for (let i = this._minDate.getFullYear(); i <= this._maxDate.getFullYear(); i++) {
      let now = new Date();
      if (now.getFullYear() === i && month !== null &&
        (isReverse && month > now.getMonth() || !isReverse && month < now.getMonth())) {
        continue;
      }

      this._years.push({value: i, name: i});
    }

    // Verify if the order of the years must be reversed.
    if (isReverse) {
      this._years.reverse();
    }

    // Prepend the years placeholder
    if (this.placeHolders) {
      this._years.unshift(this.placeHolders[0]);
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
    this._dates = [];
    if (this.placeHolders) {
      this._dates.push(this.placeHolders[2]);
    }
    for (let i = start; i <= end; i++) {
      this._dates.push({value: i, name: i});
    }
  };

  // Initialize place holders.
  updatePlaceholders() {
    this.placeHolders = null;
    if (this.placeholder !== undefined && this.placeholder !== null &&
      (typeof this.placeholder === 'string' || Array.isArray(this.placeholder))) {

      let holders = typeof this.placeholder === 'string' ?
        this.placeholder.split(',') : this.placeholder;
      if (holders.length === 3) {
        this.placeHolders = [];
        for (let h of holders) {
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
  adjustTimezone (myDate, myTimezone) {
    const offset = isNaN(myTimezone) ? new Date().getTimezoneOffset() : parseFloat(myTimezone) * 60;
    return new Date(myDate.getTime() + offset * 60 * 1000);
  }

  // Function to parse a JSON object.
  parseJsonPlus(jsonObj) {
    let res = null;
    if (jsonObj != null) {
      try { res = JSON.parse(jsonObj); }catch(ex) {}
      if (res == null) try { res = JSON.parse(jsonObj.replace(/'/g, '"')); }catch (ex) {}
    }
    return res;
  }

  // Function to parse an string returning either a number or 'null' (instead of NaN).
  parseIntStrict(num) {
    return (num !== null && num !== '' && parseInt(num) !== NaN) ? parseInt(num) : null;
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


export default class DateUtils {
  static adjustTimezone(myDate, myTimezone) {
    const offset = isNaN(myTimezone) ? new Date().getTimezoneOffset() : parseFloat(myTimezone) * 60;
    return new Date(myDate.getTime() + offset * 60 * 1000);
  }

  static parseIntStrict(num) {
    return (num !== null && num !== '' && isNaN(parseInt(num, 10))) ? parseInt(num, 10) : null;
  }

  static getMaxDate(month, year) {
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

  static parseDate(myDate, myTimezone) {
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
          res = DateUtils.adjustTimezone(res, myTimezone);
        }
      }
    }
    return res;
  }
}

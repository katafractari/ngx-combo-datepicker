# Inputs

| Property        | Type        | Default Value | Description                                                                                                     |
|:----------------|:------------|:--------------|:----------------------------------------------------------------------------------------------------------------|
| date         | Date &#124; string    |  | Initial date |
| minDate         | Date &#124; string  |               | Minimum date that can be chosen. By default the minimum date is 100 years before the current date.
| maxDate         | Date &#124; string  |               | Maximum date that can be chosen. By default the maximum date is the current date.
| months          | string      |               | Names of the twelve months, separated by comma.
| order    | string      | 'dmy'   | 'd', 'm' and 'y' indicating in which order the combo boxes must be displayed. 
| attrsDate      | object     | | An object with the attributes (such as class or style) to add to the select element for the date.
| attrsMonth      | object     | | An object with the attributes (such as class or style) to add to the select element for the date.
| attrsYear      | object     | | An object with the attributes (such as class or style) to add to the select element for the date.
| yearOrder        | string     | 'ascending'         | Sorting of years ("ascending" or "descending")
| timezone        | number     | | A number indicating the timezone to be used when converting a string or an integer to a date. By default the timezone of the client is used.
| placeholder        | string     | | Placeholders for the year, month and date combo boxes (in that order), separated by comma.
| disabled        | boolean &#124; boolean[] | false | A single boolean value indicating if combo boxes should be disabled or an array of boolean values indicating a disabled state for each of the three combo boxes


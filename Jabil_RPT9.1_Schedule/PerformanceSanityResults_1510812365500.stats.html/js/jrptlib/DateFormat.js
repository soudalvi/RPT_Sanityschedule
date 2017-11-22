define(["require", "exports", "dojo/date/locale"], function (require, exports, Locale) {
    "use strict";
    var DateFormat = (function () {
        function DateFormat(date) {
            this.date = null;
            if (date instanceof Date)
                this.date = date;
            else if (date === parseInt(date, 10)) {
                this.date = new Date(date);
            }
            else if (typeof date === 'string') {
                this.date = new Date(parseInt(date));
            }
            else
                throw date + " is not a Date object or a integer or a string";
        }
        DateFormat.prototype.toDateString = function () {
            return Locale.format(this.date, {
                formatLength: "short"
            });
        };
        return DateFormat;
    }());
    return DateFormat;
});

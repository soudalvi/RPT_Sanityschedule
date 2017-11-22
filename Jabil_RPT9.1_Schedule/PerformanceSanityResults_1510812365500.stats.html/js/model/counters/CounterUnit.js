define(["require", "exports", "jrptlib/FormatLocale!", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, format, NLS, APPMSG) {
    "use strict";
    function highest(domain) {
        var highest = domain[1];
        if (highest < 0 || (domain[0] < 0 && -domain[0] > highest))
            highest = -domain[0];
        return highest;
    }
    var f_integer = format.numberFormat(",.0f");
    var f_twodigits = format.numberFormat("02.0f");
    var f_float = format.numberFormat(",.3r");
    function f_text(value) {
        return value;
    }
    function f_reqstatus(value) {
        return value ? APPMSG.VFormat_StatusPassed : APPMSG.VFormat_StatusFailed;
    }
    function f_percent(value) {
        return NLS.bind(APPMSG.VFormat_Percent, f_float(value));
    }
    function f_millis(millis) {
        if (millis < 1000)
            return NLS.bind(APPMSG.VFormat_Millis, f_integer(millis));
        var seconds = millis / 1000;
        if (seconds < 60)
            return NLS.bind(APPMSG.VFormat_Seconds, f_float(seconds));
        return f_seconds(seconds);
    }
    function s_millis(highest) {
        if (highest < 2000)
            return scale(1, APPMSG.T("UMS"));
        if (highest < 120000)
            return scale(1000, APPMSG.T("USEC"));
        if (highest < 7200000)
            return scale(60000, APPMSG.T("UMIN"));
        if (highest < 259200000)
            return scale(3600000, APPMSG.T("UHOURS"));
        return scale(86400000, APPMSG.T("UDAYS"));
    }
    function f_seconds(seconds) {
        if (seconds < 60)
            return NLS.bind(APPMSG.VFormat_Seconds, f_integer(seconds));
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        if (minutes < 60)
            return NLS.bind(APPMSG.VFormat_Minutes, [f_twodigits(minutes), f_twodigits(seconds)]);
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return NLS.bind(APPMSG.VFormat_Hours, [f_integer(hours), f_twodigits(minutes), f_twodigits(seconds)]);
    }
    function s_seconds(highest) {
        if (highest < 120)
            return scale(1, APPMSG.T("USEC"), t_seconds);
        if (highest < 7200)
            return scale(60, APPMSG.T("UMIN"), t_minutes);
        if (highest < 259200)
            return scale(3600, APPMSG.T("UHOURS"), t_hours);
        return scale(86400, APPMSG.T("UDAYS"), t_days);
    }
    function t_seconds(seconds) {
        if (seconds % 1)
            return f_float(seconds);
        return f_integer(seconds);
    }
    function t_minutes(minutes) {
        var secs = Math.round(minutes * 60) % 60;
        if (secs)
            return NLS.bind("{0}:{1}", [f_integer(Math.floor(minutes)), f_twodigits(secs)]);
        return f_integer(minutes);
    }
    function t_hours(hours) {
        var secs = Math.round(hours * 3600) % 60;
        var mins = Math.floor(hours * 60) % 60;
        hours = Math.floor(hours);
        if (secs)
            return NLS.bind("{0}:{1}:{2}", [f_integer(hours), f_twodigits(mins), f_twodigits(secs)]);
        if (mins)
            return NLS.bind("{0}:{1}", [f_integer(hours), f_twodigits(mins)]);
        return f_integer(hours);
    }
    function t_days(days) {
        var secs = Math.round(days * 86400) % 60;
        var mins = Math.floor(days * 1440) % 60;
        var hours = Math.floor(days * 24) % 24;
        days = Math.floor(days);
        if (secs)
            return NLS.bind("{0}:{1}:{2}:{3}", [f_integer(days), f_twodigits(hours), f_twodigits(mins), f_twodigits(secs)]);
        if (mins)
            return NLS.bind("{0}:{1}:{2}:{3}", [f_integer(days), f_twodigits(hours), f_twodigits(mins)]);
        if (hours)
            return NLS.bind("{0}:{1}:00", [f_integer(days), f_twodigits(hours), "00"]);
        return f_integer(days);
    }
    function f_time(time) {
        return new Date(time).toString();
    }
    function f_bytes(bytes) {
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_Bytes, f_integer(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_KiloBytes, f_float(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_MegaBytes, f_float(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_GigaBytes, f_float(bytes));
        bytes = bytes / 1000;
        return NLS.bind(APPMSG.VFormat_TeraBytes, f_float(bytes));
    }
    function s_1000(units) {
        return function (highest) {
            var factor = 1;
            var i = 0;
            var up = units.length - 1;
            for (; i < up; i++) {
                if (highest < 2000 * factor)
                    break;
                factor *= 1000;
            }
            return scale(factor, units[i]);
        };
    }
    function persec(units) {
        return units.map(function (u) { return NLS.bind(APPMSG.UFormat_Persec, u); });
    }
    function f_byte_rate(bytes) {
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_BytesPS, f_integer(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_KiloBytesPS, f_float(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_MegaBytesPS, f_float(bytes));
        bytes = bytes / 1000;
        if (bytes < 1000)
            return NLS.bind(APPMSG.VFormat_GigaBytesPS, f_float(bytes));
        bytes = bytes / 1000;
        return NLS.bind(APPMSG.VFormat_TeraBytesPS, f_float(bytes));
    }
    function f_run_status(status) {
        return APPMSG.T(status);
    }
    function f_syncpoint_state(state) {
        switch (state) {
            case 1: return APPMSG.SyncPointStateInactive;
            case 2: return APPMSG.SyncPointStateActive;
            case 3: return APPMSG.SyncPointStateReleased;
        }
        return "";
    }
    function f_rategen_state(state) {
        return APPMSG.T("RateGen_" + state);
    }
    function getScaleFactor(highest) {
        if (isNaN(highest))
            return 1;
        for (var factor = 1;; factor *= 1000) {
            if (highest < factor * 2000)
                return factor;
        }
    }
    function scale(factor, unit, display) {
        if (factor == 1)
            return { translate: function (d) { return d; }, unit: unit, display: display };
        return { translate: function (d) { return d / factor; }, unit: unit, display: display };
    }
    function s_default(highest, unitLabel) {
        var factor = getScaleFactor(highest);
        if (factor != 1)
            unitLabel = NLS.bind(APPMSG.T("UMULT"), [f_integer(factor), unitLabel]);
        return scale(factor, unitLabel);
    }
    function f_with_default(f, defValue) {
        return function (value) {
            if (value === undefined || value === null)
                value = defValue;
            return f(value);
        };
    }
    function f_no_default(f) {
        return function (value) {
            if (value === undefined || value === null)
                return APPMSG.NotDefined;
            return f(value);
        };
    }
    var MillisecondsFormat = {
        defaultRange: [0, 1000],
        requiredRange: [0, 10],
        displayValue: f_millis,
        scaleFactor: s_millis
    };
    var SecondsFormat = {
        defaultRange: [0, 60],
        requiredRange: [0, 5],
        displayValue: f_seconds,
        scaleFactor: s_seconds
    };
    var TimeFormat = {
        defaultRange: [946684800000, 1893456000],
        requiredRange: null,
        displayValue: f_time,
        label: null
    };
    var PercentFormat = {
        defaultRange: [0, 100],
        requiredRange: [0, 100],
        displayValue: f_percent
    };
    var byteMultiples = [APPMSG.T("UBYTES"), APPMSG.T("UKBYTES"), APPMSG.T("UMBYTES"), APPMSG.T("UGBYTES"), APPMSG.T("UTBYTES"), APPMSG.T("UPBYTES")];
    var BytesFormat = {
        defaultRange: [0, 1000],
        requiredRange: [0, 1],
        displayValue: f_bytes,
        scaleFactor: s_1000(byteMultiples)
    };
    var BytesPerSecFormat = {
        defaultRange: [0, 1000],
        requiredRange: [0, .1],
        displayValue: f_byte_rate,
        scaleFactor: s_1000(persec(byteMultiples))
    };
    var NoUnitFormat = {
        defaultRange: null,
        requiredRange: null,
        label: null,
        displayValue: f_text
    };
    var RequirementPassedFormat = {
        defaultRange: [0, 1],
        requiredRange: [0, 1],
        label: "",
        displayValue: f_reqstatus
    };
    var RunStatusFormat = {
        defaultRange: null,
        requiredRange: null,
        label: null,
        displayValue: f_run_status
    };
    var SyncPointStateFormat = {
        defaultRange: null,
        requiredRange: null,
        label: null,
        displayValue: f_syncpoint_state
    };
    var RateGenStateFormat = {
        defaultRange: null,
        requiredRange: null,
        label: null,
        displayValue: f_rategen_state
    };
    var DefaultDiscreteFormat = {
        defaultRange: [0, 5],
        requiredRange: [0, 5],
        scaleFactor: s_default
    };
    var DefaultContinuousFormat = {
        defaultRange: [0, 1],
        requiredRange: [0, .1],
        scaleFactor: s_default
    };
    var UnspecifiedDiscreteFormat = {
        defaultRange: [0, 5],
        requiredRange: [0, 5],
        label: "",
        scaleFactor: s_default
    };
    var UnspecifiedContinuousFormat = {
        defaultRange: [0, 1],
        requiredRange: [0, .1],
        label: "",
        scaleFactor: s_default
    };
    function getFormat(id, float) {
        if (!id)
            return NoUnitFormat;
        switch (id) {
            case "UMS":
            case "UMilliSeconds":
                return MillisecondsFormat;
            case "USEC":
                return SecondsFormat;
            case "UTIME":
                return TimeFormat;
            case "UPERCENT":
                return PercentFormat;
            case "UBYTES":
                return BytesFormat;
            case "UBYTES_PER_SEC":
                return BytesPerSecFormat;
            case "UREQSTATUS":
                return RequirementPassedFormat;
            case "URUNSTATUS":
                return RunStatusFormat;
            case "USYNCPTSTATE":
                return SyncPointStateFormat;
            case "URATEGENSTATE":
                return RateGenStateFormat;
            case "UUNSPECIFIED":
                return float ? UnspecifiedContinuousFormat : UnspecifiedDiscreteFormat;
            default:
                return float ? DefaultContinuousFormat : DefaultDiscreteFormat;
        }
    }
    var CounterUnit = (function () {
        function CounterUnit(id, label, format) {
            this.id = id;
            this.label = label;
            this.counterIndices = [];
            this.format = format;
            if (this.format.label !== undefined) {
                this.label = this.format.label;
            }
        }
        CounterUnit.prototype.addCounterIndex = function (index) {
            this.counterIndices.push(index);
        };
        CounterUnit.prototype.removeCounterIndex = function (index) {
            var i = this.counterIndices.indexOf(index);
            if (i != -1) {
                this.counterIndices.splice(i, 1);
            }
        };
        CounterUnit.prototype.isNumeric = function () {
            return this.label !== null;
        };
        CounterUnit.prototype.requiredRange = function () {
            return this.format.requiredRange;
        };
        CounterUnit.prototype.defaultRange = function () {
            return this.format.defaultRange;
        };
        CounterUnit.prototype.formatRoutine = function (component) {
            var f = this.format.displayValue;
            if (!f)
                f = component.float ? f_float : f_integer;
            if (component.defaultValue === undefined) {
                return f_no_default(f);
            }
            return f_with_default(f, component.defaultValue);
        };
        CounterUnit.prototype.scaleFactor = function (range) {
            if (this.format.scaleFactor) {
                return this.format.scaleFactor(highest(range), this.label);
            }
            return scale(1, this.label);
        };
        CounterUnit.prototype.getCounterIndices = function (filter) {
            var counterIndices = this.counterIndices;
            if (filter) {
                counterIndices = counterIndices.filter(function (n) { return filter.indexOf(n) != -1; });
            }
            return counterIndices;
        };
        CounterUnit.prototype.same = function (other) {
            return this.id == other.id;
        };
        CounterUnit.create = function (counterUnit, counterLabel, type, component) {
            var id = component.unitId(counterUnit);
            return new CounterUnit(id, component.unitLabel(counterLabel), getFormat(id, type.discrete));
        };
        CounterUnit.SECONDS = new CounterUnit("USEC", APPMSG.secSymbol, SecondsFormat);
        return CounterUnit;
    }());
    exports.CounterUnit = CounterUnit;
});

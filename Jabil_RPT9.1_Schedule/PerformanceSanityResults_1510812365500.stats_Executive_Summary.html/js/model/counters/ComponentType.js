define(["require", "exports", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, NLS, APPMSG) {
    "use strict";
    var u_same = {
        id: function (unit) { return unit; },
        label: function (unit) { return unit; }
    };
    var u_percent = {
        id: function (unit) { return "UPERCENT"; },
        label: function (unit) { return APPMSG.UFormat_Percent; }
    };
    var u_rate = {
        id: function (unit) { return unit + "_PER_SEC"; },
        label: function (unit) { return NLS.bind(APPMSG.UFormat_Persec, unit); }
    };
    var u_square = {
        id: function (unit) { return unit + "_SQUARE"; },
        label: function (unit) { return NLS.bind(APPMSG.UFormat_Square, unit); }
    };
    var u_units = {
        id: function (unit) { return "UUNITS"; },
        label: function (unit) { return APPMSG.UFormat_Units; }
    };
    var u_reqs = {
        id: function (unit) { return "UREQS"; },
        label: function (unit) { return APPMSG.UFormat_Requirements; }
    };
    var u_req_status = {
        id: function (unit) { return "UREQSTATUS"; },
        label: function (unit) { return ""; }
    };
    var u_time = {
        id: function (unit) { return "UTIME"; },
        label: function (unit) { return ""; }
    };
    var u_duration = {
        id: function (unit) { return "UMS"; },
        label: function (unit) { return ""; }
    };
    var u_none = {
        id: function (unit) { return ""; },
        label: function (unit) { return ""; }
    };
    function cl(label) {
        return function () { return label; };
    }
    function ml(map) {
        return function (componentName) { return map[componentName]; };
    }
    function dl(componentName) {
        return NLS.bind(APPMSG.CounterComponent_Percentile ? APPMSG.CounterComponent_Percentile : "Percentile/{0}", componentName.substring(11));
    }
    var ComponentType = (function () {
        function ComponentType(name, label, unit, float, segmentsCount, defaultValue, isImplicit) {
            this.name = name;
            this._label = label;
            this._unit = unit;
            this.float = float;
            this.segmentsCount = segmentsCount;
            this.defaultValue = defaultValue;
            this.isImplicit = isImplicit;
        }
        ComponentType.prototype.label = function (componentName) {
            return this._label(componentName);
        };
        ComponentType.prototype.unitId = function (counterUnit) {
            return this._unit.id(counterUnit);
        };
        ComponentType.prototype.unitLabel = function (counterUnitLabel) {
            return this._unit.label(counterUnitLabel);
        };
        ComponentType.prototype.toString = function () {
            return this.name;
        };
        ComponentType.fromString = function (name) {
            if (!name)
                return null;
            return ComponentType[name];
        };
        ComponentType.COUNT = new ComponentType("COUNT", cl(APPMSG.CounterComponent_Count), u_same, false, 1, 0, true);
        ComponentType.RATE = new ComponentType("RATE", cl(APPMSG.CounterComponent_Rate), u_rate, true, 1, 0, false);
        ComponentType.RATE_MIN = new ComponentType("RATE_MIN", cl(APPMSG.CounterComponent_MinRate), u_rate, true, 1, 0, false);
        ComponentType.RATE_MAX = new ComponentType("RATE_MAX", cl(APPMSG.CounterComponent_MaxRate), u_rate, true, 1, 0, false);
        ComponentType.INCREMENT = new ComponentType("INCREMENT", cl(APPMSG.CounterComponent_Increment), u_same, false, 1, 0, true);
        ComponentType.INCREMENT_RATE = new ComponentType("INCREMENT_RATE", cl(APPMSG.CounterComponent_IncrementRate), u_rate, true, 1, 0, false);
        ComponentType.INCREMENT_LEXT = new ComponentType("INCREMENT_LEXT", cl(APPMSG.CounterComponent_LExt), u_same, false, 1, 0, false);
        ComponentType.INCREMENT_REXT = new ComponentType("INCREMENT_REXT", cl(APPMSG.CounterComponent_RExt), u_same, false, 1, 0, false);
        ComponentType.VALUE = new ComponentType("VALUE", cl(APPMSG.CounterComponent_Mean), u_same, true, 0, undefined, true);
        ComponentType.VALUE_WEIGHT = new ComponentType("VALUE_WEIGHT", cl(APPMSG.CounterComponent_Weight), u_units, false, 1, 0, false);
        ComponentType.VALUE_SUM = new ComponentType("VALUE_SUM", cl(APPMSG.CounterComponent_Sum), u_same, false, 1, 0, false);
        ComponentType.VALUE_MEAN = new ComponentType("VALUE_MEAN", cl(APPMSG.CounterComponent_Mean), u_same, true, 1, undefined, false);
        ComponentType.VALUE_M2 = new ComponentType("VALUE_M2", cl(APPMSG.CounterComponent_M2), u_square, true, 1, undefined, false);
        ComponentType.VALUE_STDDEV = new ComponentType("VALUE_STDDEV", cl(APPMSG.CounterComponent_StdDev), u_same, true, 1, undefined, false);
        ComponentType.VALUE_MIN = new ComponentType("VALUE_MIN", cl(APPMSG.CounterComponent_Min), u_same, false, 1, undefined, false);
        ComponentType.VALUE_MAX = new ComponentType("VALUE_MAX", cl(APPMSG.CounterComponent_Max), u_same, false, 1, undefined, false);
        ComponentType.VALUE_PERCENTILE = new ComponentType("VALUE_PERCENTILE", dl, u_same, false, 2, undefined, false);
        ComponentType.VALUE_PERCENTILE_GENERIC = new ComponentType("VALUE_PERCENTILE_GENERIC", cl("Percentiles (preferences)"), u_same, false, 2, undefined, false);
        ComponentType.PERCENT = new ComponentType("PERCENT", cl(APPMSG.CounterComponent_Percent), u_percent, true, 1, undefined, false);
        ComponentType.PERCENT_NUMERATOR = new ComponentType("PERCENT_NUMERATOR", cl(APPMSG.CounterComponent_Numerator), u_same, false, 1, 0, false);
        ComponentType.PERCENT_DENOMINATOR = new ComponentType("PERCENT_DENOMINATOR", cl(APPMSG.CounterComponent_Denominator), u_same, false, 1, 0, false);
        ComponentType.SPERCENT = new ComponentType("SPERCENT", cl(APPMSG.CounterComponent_Percent), u_percent, true, 1, undefined, false);
        ComponentType.SPERCENT_NUMERATOR = new ComponentType("SPERCENT_NUMERATOR", cl(APPMSG.CounterComponent_Numerator), u_same, false, 1, 0, false);
        ComponentType.SPERCENT_DENOMINATOR = new ComponentType("SPERCENT_DENOMINATOR", cl(APPMSG.CounterComponent_Denominator), u_same, false, 1, 0, false);
        ComponentType.TEXT = new ComponentType("TEXT", cl(APPMSG.CounterComponent_Text), u_same, false, 0, undefined, true);
        ComponentType.REQVERDICT_STATUS = new ComponentType("REQVERDICT_STATUS", cl(APPMSG.CounterComponent_Status), u_req_status, false, 1, undefined, false);
        ComponentType.REQVERDICT_COUNT = new ComponentType("REQVERDICT_COUNT", ml({
            "PassCount": APPMSG.CounterComponent_PassCount,
            "FailCount": APPMSG.CounterComponent_FailCount
        }), u_reqs, false, 1, 0, false);
        ComponentType.REQVERDICT_PERCENT = new ComponentType("REQVERDICT_PERCENT", ml({
            "PassPercent": APPMSG.CounterComponent_PassPercent,
            "FailPercent": APPMSG.CounterComponent_FailPercent
        }), u_percent, true, 1, undefined, false);
        ComponentType.REQEVAL_MARGIN = new ComponentType("REQEVAL_MARGIN", cl(APPMSG.CounterComponent_Margin), u_percent, true, 1, undefined, false);
        ComponentType.REQEVAL_VALUE = new ComponentType("REQEVAL_VALUE", cl(APPMSG.CounterComponent_Observed), u_same, true, 1, undefined, false);
        ComponentType.TIME = new ComponentType("TIME", cl(APPMSG.CounterComponent_TimeAbsolute), u_time, false, 2, undefined, false);
        ComponentType.DURATION = new ComponentType("DURATION", ml({
            "FirstTime/Relative": APPMSG.CounterComponent_TimeRelative,
            "FirstTime/Elapsed": APPMSG.CounterComponent_TimeElapsed
        }), u_duration, false, 2, undefined, false);
        return ComponentType;
    }());
    return ComponentType;
});

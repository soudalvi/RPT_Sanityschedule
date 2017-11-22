var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "model/counters/ComponentType"], function (require, exports, ComponentType) {
    "use strict";
    var CounterType = (function () {
        function CounterType(name, discrete) {
            this.name = name;
            this.discrete = discrete;
        }
        CounterType.prototype.toString = function () {
            return this.name;
        };
        CounterType.fromString = function (name) {
            if (!name)
                return null;
            return Types[name];
        };
        return CounterType;
    }());
    var StaticCounterType = (function (_super) {
        __extends(StaticCounterType, _super);
        function StaticCounterType(name, discrete, comps) {
            _super.call(this, name, discrete);
            this._components = comps;
        }
        StaticCounterType.prototype.component = function (name) {
            return this._components[name];
        };
        StaticCounterType.prototype.components = function () {
            return Object.keys(this._components);
        };
        return StaticCounterType;
    }(CounterType));
    var PERCENTILE = /^Percentile\/([0-9]+)$/;
    var DistributionCounterType = (function (_super) {
        __extends(DistributionCounterType, _super);
        function DistributionCounterType(name, discrete, comps) {
            _super.call(this, name, discrete, comps);
        }
        DistributionCounterType.prototype.component = function (name) {
            var r = PERCENTILE.exec(name);
            if (r) {
                var p = +r[1];
                if (p > 0 && p < 100)
                    return ComponentType.VALUE_PERCENTILE;
            }
            return _super.prototype.component.call(this, name);
        };
        DistributionCounterType.prototype.components = function () {
            var ret = _super.prototype.components.call(this);
            for (var i = 1; i < 100; i++) {
                ret.push("Percentile/" + i);
            }
            return ret;
        };
        return DistributionCounterType;
    }(StaticCounterType));
    var Types = (function () {
        function Types() {
        }
        Types.COUNT_BASIC = new StaticCounterType("COUNT_BASIC", true, {
            "Count": ComponentType.COUNT,
            "Rate": ComponentType.RATE
        });
        Types.COUNT_RATE_RANGE = new StaticCounterType("COUNT_RATE_RANGE", true, {
            "Count": ComponentType.COUNT,
            "Rate": ComponentType.RATE,
            "MinRate": ComponentType.RATE_MIN,
            "MaxRate": ComponentType.RATE_MAX
        });
        Types.INCREMENT_BASIC = new StaticCounterType("INCREMENT_BASIC", true, {
            "Increment": ComponentType.INCREMENT,
            "Rate": ComponentType.INCREMENT_RATE
        });
        Types.INCREMENT_EXTENT = new StaticCounterType("INCREMENT_EXTENT", true, {
            "Increment": ComponentType.INCREMENT,
            "Rate": ComponentType.INCREMENT_RATE,
            "LExt": ComponentType.INCREMENT_LEXT,
            "RExt": ComponentType.INCREMENT_REXT
        });
        Types.VALUE_BASIC = new StaticCounterType("VALUE_BASIC", false, {
            "": ComponentType.VALUE_MEAN
        });
        Types.VALUE_AVERAGE = new StaticCounterType("VALUE_AVERAGE", false, {
            "Mean": ComponentType.VALUE_MEAN,
            "Sum": ComponentType.VALUE_SUM,
            "Weight": ComponentType.VALUE_WEIGHT
        });
        Types.VALUE_STDDEV = new StaticCounterType("VALUE_STDDEV", false, {
            "Mean": ComponentType.VALUE_MEAN,
            "StdDev": ComponentType.VALUE_STDDEV,
            "Sum": ComponentType.VALUE_SUM,
            "Weight": ComponentType.VALUE_WEIGHT,
            "M2": ComponentType.VALUE_M2
        });
        Types.VALUE_RANGE = new StaticCounterType("VALUE_RANGE", false, {
            "Mean": ComponentType.VALUE_MEAN,
            "StdDev": ComponentType.VALUE_STDDEV,
            "Min": ComponentType.VALUE_MIN,
            "Max": ComponentType.VALUE_MAX,
            "Sum": ComponentType.VALUE_SUM,
            "Weight": ComponentType.VALUE_WEIGHT,
            "M2": ComponentType.VALUE_M2
        });
        Types.VALUE_DISTRIBUTION = new DistributionCounterType("VALUE_DISTRIBUTION", false, {
            "Mean": ComponentType.VALUE_MEAN,
            "StdDev": ComponentType.VALUE_STDDEV,
            "Min": ComponentType.VALUE_MIN,
            "Max": ComponentType.VALUE_MAX,
            "Sum": ComponentType.VALUE_SUM,
            "Weight": ComponentType.VALUE_WEIGHT,
            "M2": ComponentType.VALUE_M2
        });
        Types.VALUE_MIN = new StaticCounterType("VALUE_MIN", false, {
            "": ComponentType.VALUE_MIN
        });
        Types.VALUE_MAX = new StaticCounterType("VALUE_MAX", false, {
            "": ComponentType.VALUE_MAX
        });
        Types.TEXT_UPDATABLE = new StaticCounterType("TEXT_UPDATABLE", false, {
            "": ComponentType.TEXT
        });
        Types.TEXT_CONCATENABLE = new StaticCounterType("TEXT_CONCATENABLE", false, {
            "": ComponentType.TEXT
        });
        Types.PERCENT = new StaticCounterType("PERCENT", false, {
            "Percent": ComponentType.PERCENT,
            "Numerator": ComponentType.PERCENT_NUMERATOR,
            "Denominator": ComponentType.PERCENT_DENOMINATOR
        });
        Types.SPERCENT = new StaticCounterType("SPERCENT", false, {
            "Percent": ComponentType.SPERCENT,
            "Numerator": ComponentType.SPERCENT_NUMERATOR,
            "Denominator": ComponentType.SPERCENT_DENOMINATOR
        });
        Types.REQUIREMENT_VERDICT = new StaticCounterType("REQUIREMENT_VERDICT", false, {
            "Status": ComponentType.REQVERDICT_STATUS,
            "PassCount": ComponentType.REQVERDICT_COUNT,
            "FailCount": ComponentType.REQVERDICT_COUNT,
            "PassPercent": ComponentType.REQVERDICT_PERCENT,
            "FailPercent": ComponentType.REQVERDICT_PERCENT,
            "TotalCount": ComponentType.REQVERDICT_COUNT
        });
        Types.REQUIREMENT_EVAL = new StaticCounterType("REQUIREMENT_EVAL", false, {
            "Status": ComponentType.REQVERDICT_STATUS,
            "Margin": ComponentType.REQEVAL_MARGIN,
            "Observed": ComponentType.REQEVAL_VALUE,
            "PassCount": ComponentType.REQVERDICT_COUNT,
            "FailCount": ComponentType.REQVERDICT_COUNT,
            "PassPercent": ComponentType.REQVERDICT_PERCENT,
            "FailPercent": ComponentType.REQVERDICT_PERCENT,
            "TotalCount": ComponentType.REQVERDICT_COUNT
        });
        return Types;
    }());
    return CounterType;
});

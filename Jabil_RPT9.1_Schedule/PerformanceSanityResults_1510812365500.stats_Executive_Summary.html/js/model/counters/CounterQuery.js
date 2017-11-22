define(["require", "exports", "model/counters/CounterType", "model/counters/ComponentType", "model/counters/CounterUnit", "jrptlib/Nls", "jrptlib/Properties!APPMSG", "ui/Prefs!"], function (require, exports, CounterType, ComponentType, CounterUnit_1, NLS, APPMSG, Prefs) {
    "use strict";
    var LabelOptions = (function () {
        function LabelOptions() {
            this.showCumulated = true;
        }
        return LabelOptions;
    }());
    var universalComponents = {
        "FirstTime/Absolute": ComponentType.TIME,
        "FirstTime/Relative": ComponentType.DURATION,
        "FirstTime/Elapsed": ComponentType.DURATION,
        "LastTime/Absolute": ComponentType.TIME,
        "LastTime/Relative": ComponentType.DURATION,
        "LastTime/Elapsed": ComponentType.DURATION
    };
    var CounterQuery = (function () {
        function CounterQuery(path, counterType, counterUnit, counterLabel, counterUnitLabel, componentType, queryName) {
            this.componentType = componentType;
            this.counterType = counterType;
            this.counterUnit = counterUnit;
            this.counterUnitLabel = counterUnitLabel;
            this.queryName = queryName;
            var segments = path.split("/");
            var counterPath;
            if (componentType.segmentsCount == 0) {
                this.component = "";
                counterPath = segments;
            }
            else {
                this.component = segments.slice(-componentType.segmentsCount).join("/");
                counterPath = segments.slice(0, -componentType.segmentsCount);
            }
            if (counterPath[counterPath.length - 1] == "Cumulated") {
                counterPath.splice(counterPath.length - 1, 1);
                this.isCumulated = true;
            }
            else {
                this.isCumulated = false;
            }
            this.counterPath = counterPath.join("/");
            this.wildcards = CounterQuery.parseWildcards(this.counterPath);
            this.counterLabel = counterLabel;
        }
        CounterQuery.prototype.duplicate = function () {
            return new CounterQuery(this.path(), this.counterType, this.counterUnit, this.counterLabel, this.counterUnitLabel, this.componentType, this.queryName);
        };
        CounterQuery.prototype._setOwner = function (owner, index) {
            this.owner = owner;
            if (owner) {
                this.index = index;
                owner._unitChanged(this);
                this.format = this.unit.formatRoutine(this.componentType);
            }
            else {
                this.owner = undefined;
                this.index = undefined;
                this.unit = undefined;
                this.unitIndex = undefined;
                this.format = null;
            }
        };
        CounterQuery.prototype._unit = function () {
            return CounterUnit_1.CounterUnit.create(this.counterUnit, this.counterUnitLabel, this.counterType, this.componentType);
        };
        CounterQuery.prototype.nlunit = function () {
            return this._unit().label;
        };
        CounterQuery.prototype.path = function () {
            var ret = this.counterPath;
            if (this.isCumulated)
                ret += "/Cumulated";
            if (this.component.length > 0) {
                ret += "/" + this.component;
            }
            return ret;
        };
        CounterQuery.prototype.label = function (options) {
            if (this.queryName)
                return this.queryName;
            if (!options)
                options = new LabelOptions();
            var label = this.counterLabel;
            if (this.component && !this.componentType.isImplicit) {
                var componentLabel = this.componentType.label(this.component);
                label = NLS.bind(APPMSG.CounterWithComponentLabel, [this.counterLabel, componentLabel]);
            }
            if (options.showCumulated && this.isCumulated) {
                return NLS.bind(APPMSG.CumulatedCounterLabel, [label]);
            }
            else {
                return label;
            }
        };
        CounterQuery.prototype.property = function (tag) {
            switch (tag) {
                case "name": return this.queryName || this.counterLabel;
                case "counter": return this.counterLabel;
                case "component": return this.component ? this.componentType.label(this.component) : "";
                case "component-cumul": return this.component ? NLS.bind(APPMSG.CumulatedCounterLabel, [this.componentType.label(this.component)]) : "";
                default: return "";
            }
        };
        CounterQuery.prototype.setCumulated = function (cumulated) {
            this.isCumulated = cumulated;
        };
        CounterQuery.prototype.setComponent = function (component) {
            var componentType;
            if (!this.isCumulated) {
                componentType = universalComponents[component];
            }
            if (!componentType) {
                componentType = this.counterType.component(component);
            }
            if (!componentType)
                throw "Component is not defined";
            this.component = component;
            this.componentType = componentType;
            if (this.owner) {
                this.owner._unitChanged(this);
            }
        };
        CounterQuery.prototype.isSpecialComponent = function () {
            return universalComponents[this.component] !== undefined;
        };
        CounterQuery.prototype.displayValue = function (value) {
            return this.format(value);
        };
        CounterQuery.prototype.getDrilldowns = function () {
            if (!this.drilldowns) {
                if (!this.counterInfoNode) {
                    this.drilldowns = [];
                }
                else {
                    this.drilldowns = CounterQuery.loadDrilldowns(this.counterInfoNode);
                    this.counterInfoNode = null;
                }
            }
            return this.drilldowns;
        };
        CounterQuery.prototype.getWildcards = function (instances) {
            if (!instances)
                return this.wildcards;
            var ret = [];
            for (var i = 0; i < this.wildcards.length; i++) {
                var w = this.wildcards[i];
                if (!instances[w])
                    ret.push(w);
            }
            return ret;
        };
        CounterQuery.prototype.expand = function () {
            if (this.componentType == ComponentType.VALUE_PERCENTILE_GENERIC) {
                var ret = [];
                var percentiles = Prefs.percentiles;
                var basePath = this.path() + "/";
                for (var i = 0; i < percentiles.length; i++) {
                    var path = basePath + percentiles[i];
                    ret.push(new CounterQuery(path, this.counterType, this.counterUnit, this.counterLabel, this.counterUnitLabel, ComponentType.VALUE_PERCENTILE, this.queryName));
                }
                return ret;
            }
            return [this];
        };
        CounterQuery.prototype.toString = function () {
            return this.path();
        };
        CounterQuery.loadFromView = function (counterInfoNode) {
            var path = counterInfoNode.attr("path");
            if (!counterInfoNode.attr("unresolved")) {
                var ret = new CounterQuery(path, CounterType.fromString(counterInfoNode.attr("counterType")), counterInfoNode.attr("unit"), counterInfoNode.attr("label"), counterInfoNode.attr("nlunit"), ComponentType.fromString(counterInfoNode.attr("componentType")), counterInfoNode.attr("name"));
                ret.hasRtb = counterInfoNode.attr("hasRTB") == "true";
                if (counterInfoNode.has("drilldowns")) {
                    ret.counterInfoNode = counterInfoNode;
                }
                return ret.expand();
            }
            else {
                console.log("Ignoring counterQuery - path : " + path);
                return [];
            }
        };
        CounterQuery.loadDrilldowns = function (counterInfoNode) {
            var drilldowns = [];
            counterInfoNode.children("Drilldown").each(function (idx) {
                var counterQueries = [];
                $(this).children("CounterInfo").each(function (i) {
                    var cqs = CounterQuery.loadFromView($(this));
                    for (var i = 0; i < cqs.length; i++) {
                        counterQueries.push(cqs[i]);
                    }
                });
                var cqset;
                require(null, ["model/counters/CounterQuerySet"], function (CounterQuerySetClass) {
                    cqset = new CounterQuerySetClass(counterQueries);
                });
                cqset.label = $(this).attr("label");
                drilldowns.push(cqset);
            });
            return drilldowns;
        };
        CounterQuery.parseWildcards = function (path) {
            var segments = path.split("/");
            var ret = [];
            for (var i = 0; i < segments.length; i++) {
                var seg = segments[i];
                if (seg.charAt(0) == '[') {
                    ret.push(seg.substr(1, seg.length - 2));
                }
            }
            return ret;
        };
        CounterQuery.hasWildcards = function (path) {
            return path && path.indexOf("/[") >= 0;
        };
        CounterQuery.isEqualWildcards = function (w1, w2) {
            if (w1.length != w2.length)
                return false;
            for (var i = 0; i < w1.length; i++) {
                if (w1[i] != w2[i])
                    return false;
            }
            return true;
        };
        CounterQuery.LabelOptions = LabelOptions;
        return CounterQuery;
    }());
    return CounterQuery;
});

define(["require", "exports", "model/counters/CounterQuery", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, CounterQuery, NLS, APPMSG) {
    "use strict";
    var InstanceValueFilter = (function () {
        function InstanceValueFilter(counterQuery) {
            this.counterQuery = counterQuery;
            this.showAbove = false;
            this.thresholdValue = 1000;
        }
        InstanceValueFilter.prototype.getLabel = function () {
            if (this.counterQuery) {
                var lbl = this.counterQuery.path();
                if (this.showAbove) {
                    return NLS.bind(APPMSG.InstanceValueFilter_showAbove_withCounter, [this.thresholdValue, lbl]);
                }
                else {
                    return NLS.bind(APPMSG.InstanceValueFilter_showBelow_withCounter, [this.thresholdValue, lbl]);
                }
            }
            else {
                if (this.showAbove) {
                    return NLS.bind(APPMSG.InstanceValueFilter_showAbove_noCounter, this.thresholdValue);
                }
                else {
                    return NLS.bind(APPMSG.InstanceValueFilter_showBelow_noCounter, this.thresholdValue);
                }
            }
        };
        InstanceValueFilter.prototype.isValid = function () {
            return this.counterQuery != null;
        };
        InstanceValueFilter.prototype.saveToView = function (wildcardOptionsNode) {
            var node = $.parseXML("<ValueFilterInfo/>").documentElement;
            var cq = this.counterQuery;
            $(node).attr("path", cq.path())
                .attr("counterType", cq.counterType.toString())
                .attr("unit", cq.counterUnit)
                .attr("label", cq.counterLabel)
                .attr("nlunit", cq.counterUnitLabel)
                .attr("componentType", cq.componentType.toString())
                .attr("thresholdValue", this.thresholdValue)
                .appendTo($(wildcardOptionsNode));
            if (this.showAbove) {
                $(node).attr("showAbove", "true");
            }
        };
        InstanceValueFilter.prototype.toJson = function () {
            return {
                type: "ValueFilter",
                showAbove: this.showAbove,
                thresholdValue: this.thresholdValue,
                path: this.counterQuery.path()
            };
        };
        InstanceValueFilter.loadFromView = function (valueFilterNode) {
            var cq = $(valueFilterNode);
            var counterQueries = CounterQuery.loadFromView(cq);
            if (counterQueries.length != 1)
                return null;
            var ret = new InstanceValueFilter(counterQueries[0]);
            ret.showAbove = $(valueFilterNode).attr("showAbove") == "true";
            ret.thresholdValue = +$(valueFilterNode).attr("thresholdValue");
            return ret;
        };
        return InstanceValueFilter;
    }());
    return InstanceValueFilter;
});

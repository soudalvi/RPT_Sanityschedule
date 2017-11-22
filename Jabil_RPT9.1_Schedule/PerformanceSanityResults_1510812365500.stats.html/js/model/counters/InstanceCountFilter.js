define(["require", "exports", "model/counters/CounterQuery", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, CounterQuery, NLS, APPMSG) {
    "use strict";
    var InstanceCountFilter = (function () {
        function InstanceCountFilter(counterQuery) {
            this.counterQuery = counterQuery;
            this.showHighest = true;
            this.count = 10;
        }
        InstanceCountFilter.prototype.getLabel = function () {
            if (this.counterQuery) {
                var lbl = this.counterQuery.path();
                if (this.showHighest) {
                    return NLS.bind(APPMSG.InstanceCountFilter_showHighest_withCounter, [this.count, lbl]);
                }
                else {
                    return NLS.bind(APPMSG.InstanceCountFilter_showLowest_withCounter, [this.count, lbl]);
                }
            }
            else {
                if (this.showHighest) {
                    return NLS.bind(APPMSG.InstanceCountFilter_showHighest_noCounter, this.count);
                }
                else {
                    return NLS.bind(APPMSG.InstanceCountFilter_showLowest_noCounter, this.count);
                }
            }
        };
        InstanceCountFilter.prototype.isValid = function () {
            return this.counterQuery != null;
        };
        InstanceCountFilter.prototype.saveToView = function (wildcardOptionsNode) {
            var node = $.parseXML("<CountFilterInfo/>").documentElement;
            var cq = this.counterQuery;
            $(node).attr("path", cq.path())
                .attr("counterType", cq.counterType.toString())
                .attr("unit", cq.counterUnit)
                .attr("label", cq.counterLabel)
                .attr("nlunit", cq.counterUnitLabel)
                .attr("componentType", cq.componentType.toString())
                .attr("count", this.count)
                .appendTo($(wildcardOptionsNode));
            if (this.showHighest) {
                $(node).attr("showHighest", "true");
            }
        };
        InstanceCountFilter.prototype.toJson = function () {
            return {
                type: "CountFilter",
                showHighest: this.showHighest,
                count: this.count,
                path: this.counterQuery.path()
            };
        };
        InstanceCountFilter.loadFromView = function (countFilterNode) {
            var cq = $(countFilterNode);
            var counterQueries = CounterQuery.loadFromView(cq);
            if (counterQueries.length != 1)
                return null;
            var ret = new InstanceCountFilter(counterQueries[0]);
            ret.showHighest = $(countFilterNode).attr("showHighest") == "true";
            ret.count = +$(countFilterNode).attr("count");
            return ret;
        };
        return InstanceCountFilter;
    }());
    return InstanceCountFilter;
});

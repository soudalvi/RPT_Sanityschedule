var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "model/counters/CounterQuery", "view/query/GSessionRequestProvider", "view/query/queryUtil", "view/util/Reordering", "jrptlib/Action", "jrptlib/Properties!APPMSG"], function (require, exports, CounterQuery, GSessionRequestProvider, qu, Reordering, Action, APPMSG) {
    "use strict";
    function getInstanceProjections(cqs, instances) {
        var ret = {};
        for (var x in cqs.instances) {
            ret[x] = cqs.instances[x];
        }
        if (instances) {
            var wildcards = cqs.getWildcards();
            for (var i = 0; i < instances.length; i++) {
                ret[wildcards[i]] = instances[i];
            }
        }
        return ret;
    }
    var GQueryProvider = (function (_super) {
        __extends(GQueryProvider, _super);
        function GQueryProvider(counterQuerySet) {
            _super.call(this);
            this._setCounterQuerySet(counterQuerySet, false);
            this.drilldownStack = [counterQuerySet];
        }
        GQueryProvider.prototype._setCounterQuerySet = function (counterQuerySet, notify) {
            var _this = this;
            if (this.cqEventHandlers) {
                for (var _i = 0, _a = this.cqEventHandlers; _i < _a.length; _i++) {
                    var cq = _a[_i];
                    cq.remove();
                }
                this.cqEventHandlers = null;
            }
            var reordering;
            if (notify && this.counterQuerySet) {
                reordering = new Reordering(this.counterQuerySet.counterQueries, counterQuerySet.counterQueries);
            }
            this.counterQuerySet = counterQuerySet;
            this.counterQueries = counterQuerySet.counterQueries.slice();
            this.units = counterQuerySet.units.slice();
            this.counterLabelOptions = new CounterQuery.LabelOptions();
            this.counterLabelOptions.showCumulated = counterQuerySet.isAllCumulated() == 2;
            this.cqEventHandlers = [
                counterQuerySet.on("counterQuerySetChanged", function () {
                    var reordering = new Reordering(_this.counterQueries, _this.counterQuerySet.counterQueries);
                    _this.counterQuerySetChanged(reordering);
                }),
                counterQuerySet.on("wildcardFiltersUpdated", function () { return _this.update(true); })
            ];
            if (notify) {
                this.counterQuerySetChanged(reordering);
            }
        };
        GQueryProvider.prototype.pushCounterQuerySet = function (counterQuerySet) {
            this.drilldownStack.push(counterQuerySet);
            this._setCounterQuerySet(counterQuerySet, true);
            this.emit("drilldownChanged", {});
        };
        GQueryProvider.prototype.popCounterQuerySet = function (index) {
            if (index === undefined)
                index = this.drilldownStack.length - 2;
            var current = this.counterQuerySet;
            var nbIterations = this.drilldownStack.length - 1 - index;
            for (var i = 0; i < nbIterations; i++) {
                this.drilldownStack.pop();
            }
            this._setCounterQuerySet(this.drilldownStack[this.drilldownStack.length - 1], true);
            this.emit("drilldownChanged", {});
            return current;
        };
        GQueryProvider.prototype.getDrilldownStack = function () {
            return this.drilldownStack;
        };
        GQueryProvider.prototype.dispose = function () {
            if (this.cqEventHandlers) {
                for (var _i = 0, _a = this.cqEventHandlers; _i < _a.length; _i++) {
                    var cq = _a[_i];
                    cq.remove();
                }
                this.cqEventHandlers = null;
            }
            this.disposeSessionHandlers();
        };
        GQueryProvider.prototype.disposeSessionHandlers = function () {
            if (this.sessionEventHandlers) {
                for (var _i = 0, _a = this.sessionEventHandlers; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h.remove();
                }
                this.sessionEventHandlers = null;
            }
        };
        GQueryProvider.prototype.changed = function (event) {
            this.emit("changed", event);
        };
        GQueryProvider.prototype.setSession = function (session) {
            var _this = this;
            _super.prototype.setSession.call(this, session);
            this.disposeSessionHandlers();
            this.sessionEventHandlers = [
                this.session.on("hosts", function (details) { return _this.hostsChanged(details); })
            ];
        };
        GQueryProvider.prototype.hostsChanged = function (details) {
            if (details.compareChanged)
                return;
            this.update(true);
        };
        GQueryProvider.prototype.getPostData = function () {
            return this.counterQuerySet.getFilterAsJson();
        };
        GQueryProvider.prototype.counterQuerySetChanged = function (reordering) {
            this.counterQueries = this.counterQuerySet.counterQueries.slice();
            this.units = this.counterQuerySet.units.slice();
            this.counterLabelOptions.showCumulated = this.counterQuerySet.isAllCumulated() == 2;
        };
        GQueryProvider.prototype.setData = function (response, notify, idx) {
            var event = this.processData(response, idx);
            if (event)
                this.changed(event);
        };
        GQueryProvider.prototype.unitCount = function () {
            return this.units.length;
        };
        GQueryProvider.prototype.unitLabel = function (unitIndex) {
            return this.units[unitIndex].label;
        };
        GQueryProvider.prototype.unitScale = function (unitIndex, domain) {
            return qu.valueScale(this.units[unitIndex].scaleFactor(domain), domain);
        };
        GQueryProvider.prototype.getCounterActions = function (counterIndex, instances) {
            var instancesProjections = getInstanceProjections(this.counterQuerySet, instances);
            var actions = this.getInstanceDrilldownActions(instancesProjections);
            var counterQuery = this.counterQueries[counterIndex];
            if (instances && counterQuery.hasRtb && this.session.hasRtb) {
                var session = this.session;
                var path = counterQuery.path();
                actions.push(new Action(APPMSG.displayRTBData, function () {
                    session.displayRTB(path, instancesProjections);
                }));
            }
            return actions;
        };
        GQueryProvider.prototype.getInstanceDrilldownActions = function (instanceProjections) {
            return [];
        };
        return GQueryProvider;
    }(GSessionRequestProvider));
    exports.GQueryProvider = GQueryProvider;
});

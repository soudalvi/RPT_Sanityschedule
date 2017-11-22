var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GCompareLastQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GCompareLastQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GCompareLastWildcardQueryProvider = (function (_super) {
        __extends(GCompareLastWildcardQueryProvider, _super);
        function GCompareLastWildcardQueryProvider(counterQuerySet, sessions, bounds) {
            _super.call(this, counterQuerySet, sessions, bounds);
            this.instances = new InstancesDimension_1.InstancesDimension();
            this.dimensions = [
                this.instances,
                this.sessions,
                this.createCountersDimension()
            ];
            this.dims = [0, 1, 2];
            this.countersDimIndex = 2;
        }
        GCompareLastWildcardQueryProvider.prototype.setSession = function (session) {
            this.instances.clear();
            _super.prototype.setSession.call(this, session);
        };
        GCompareLastWildcardQueryProvider.prototype.feedValues = function (instances, event, sessionIndex) {
            var _this = this;
            var instancesChanged = this.instances.feedValues(instances, {
                instanceAdded: function (instance) {
                    var values = new Array(_this.sessions.size());
                    values[sessionIndex] = instance.counters;
                    _this.values.push(values);
                },
                instanceModified: function (instanceIndex, instance) {
                    _this.values[instanceIndex][sessionIndex] = instance.counters;
                }
            });
            if (instancesChanged) {
                event.dimensionsChanged[0] = true;
            }
        };
        GCompareLastWildcardQueryProvider.prototype.processData = function (response, idx) {
            if (response === undefined)
                throw "Empty response received from server";
            var instances = qu.instances(response);
            var flatInstances = qu.flattenInstances(instances);
            var firstTime = this.values === undefined;
            var event = {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
            if (firstTime)
                this.values = [];
            this.feedValues(flatInstances, event, idx);
            return event;
        };
        GCompareLastWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[2], this.instances.items()[index[0]]);
        };
        return GCompareLastWildcardQueryProvider;
    }(GCompareLastQueryProvider_1.GCompareLastQueryProvider));
    exports.GCompareLastWildcardQueryProvider = GCompareLastWildcardQueryProvider;
});

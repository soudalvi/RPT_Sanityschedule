var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GLastWildcardQueryProvider = (function (_super) {
        __extends(GLastWildcardQueryProvider, _super);
        function GLastWildcardQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.instances = new InstancesDimension_1.InstancesDimension();
            this.dimensions = [
                this.instances,
                this.createCountersDimension()
            ];
            this.dims = [0, 1];
            this.countersDimIndex = 1;
        }
        GLastWildcardQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        GLastWildcardQueryProvider.prototype.feedValues = function (instances, event) {
            var _this = this;
            var instancesChanged = this.instances.feedValues(instances, {
                instanceRemoved: function (instanceIndex) {
                    _this.values.splice(instanceIndex, 1);
                },
                instanceAdded: function (instance) {
                    _this.values.push(instance.counters);
                },
                instanceModified: function (instanceIndex, instance) {
                    _this.values[instanceIndex] = instance.counters;
                }
            });
            if (instancesChanged) {
                event.dimensionsChanged[0] = true;
            }
        };
        GLastWildcardQueryProvider.prototype.processData = function (response) {
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
            this.feedValues(flatInstances, event);
            return event;
        };
        GLastWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[1], this.instances.items()[index[0]]);
        };
        return GLastWildcardQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GLastWildcardQueryProvider = GLastWildcardQueryProvider;
});

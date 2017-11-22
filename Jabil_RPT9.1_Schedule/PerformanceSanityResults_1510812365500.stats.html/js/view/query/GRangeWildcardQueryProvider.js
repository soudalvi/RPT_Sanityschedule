var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GRangeQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GRangeQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GRangeWildcardQueryProvider = (function (_super) {
        __extends(GRangeWildcardQueryProvider, _super);
        function GRangeWildcardQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
            this.instances = new InstancesDimension_1.InstancesDimension();
            this.dimensions = [
                this.instances,
                this.timeRanges,
                this.createCountersDimension()
            ];
            this.dims = [0, 2, 1];
            this.countersDimIndex = 2;
        }
        GRangeWildcardQueryProvider.prototype.feedValues = function (instances, event) {
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
        GRangeWildcardQueryProvider.prototype.processData = function (response) {
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
            if (this.timeRanges.processTimeRanges(response)) {
                event.dimensionsChanged[1] = true;
            }
            return event;
        };
        GRangeWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(0, this.instances.items()[index[0]]);
        };
        return GRangeWildcardQueryProvider;
    }(GRangeQueryProvider_1.GRangeQueryProvider));
    exports.GRangeWildcardQueryProvider = GRangeWildcardQueryProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GRangeQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GRangeQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GRangeDoubleWildcardQueryProvider = (function (_super) {
        __extends(GRangeDoubleWildcardQueryProvider, _super);
        function GRangeDoubleWildcardQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
            this.instances = [
                new InstancesDimension_1.FlatInstancesDimension(),
                new InstancesDimension_1.FlatInstancesDimension()
            ];
            this.dimensions = [
                this.instances[0],
                this.instances[1],
                this.timeRanges,
                this.createCountersDimension()
            ];
            this.dims = [0, 1, 3, 2];
            this.countersDimIndex = 3;
        }
        GRangeDoubleWildcardQueryProvider.prototype.feedValues = function (instances, event) {
            var _this = this;
            var change = this.instances[0].feedTwoLevelValues(instances, this.instances[1], {
                instanceAdded: function (depth, instance, instanceIndex) {
                    if (depth == 0)
                        _this.values.push([]);
                },
                instanceRemoved: function (depth, instanceIndex) {
                    if (depth == 0)
                        _this.values.splice(instanceIndex, 1);
                },
                valueModified: function (index, instance) {
                    _this.values[index[0]][index[1]] = instance.counters;
                }
            });
            event.dimensionsChanged[0] = change[0];
            event.dimensionsChanged[1] = change[1];
        };
        GRangeDoubleWildcardQueryProvider.prototype.processData = function (response) {
            var instances = qu.instances(response);
            var firstTime = this.values === undefined;
            var event = {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
            if (firstTime)
                this.values = [];
            this.feedValues(instances, event);
            if (this.timeRanges.processTimeRanges(response)) {
                event.dimensionsChanged[2] = true;
            }
            return event;
        };
        GRangeDoubleWildcardQueryProvider.prototype.getActions = function (index) {
            return [];
        };
        return GRangeDoubleWildcardQueryProvider;
    }(GRangeQueryProvider_1.GRangeQueryProvider));
    exports.GRangeDoubleWildcardQueryProvider = GRangeDoubleWildcardQueryProvider;
});

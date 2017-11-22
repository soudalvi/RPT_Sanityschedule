var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GLastDoubleWildcardQueryProvider = (function (_super) {
        __extends(GLastDoubleWildcardQueryProvider, _super);
        function GLastDoubleWildcardQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.instances = [
                new InstancesDimension_1.FlatInstancesDimension(),
                new InstancesDimension_1.FlatInstancesDimension()
            ];
            this.dimensions = [
                this.instances[0],
                this.instances[1],
                this.createCountersDimension()
            ];
            this.dims = [0, 1, 2];
            this.countersDimIndex = 2;
        }
        GLastDoubleWildcardQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        GLastDoubleWildcardQueryProvider.prototype.feedValues = function (instances, event) {
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
        GLastDoubleWildcardQueryProvider.prototype.processData = function (response) {
            if (response === undefined)
                throw "Empty response received from server";
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
            return event;
        };
        GLastDoubleWildcardQueryProvider.prototype.getActions = function (index) {
            return [];
        };
        return GLastDoubleWildcardQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GLastDoubleWildcardQueryProvider = GLastDoubleWildcardQueryProvider;
});

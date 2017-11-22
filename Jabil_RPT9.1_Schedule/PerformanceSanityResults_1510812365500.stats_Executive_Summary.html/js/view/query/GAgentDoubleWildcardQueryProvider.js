var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/AgentsDimension", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, AgentsDimension_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GAgentDoubleWildcardQueryProvider = (function (_super) {
        __extends(GAgentDoubleWildcardQueryProvider, _super);
        function GAgentDoubleWildcardQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.instances = [
                new InstancesDimension_1.FlatInstancesDimension(),
                new InstancesDimension_1.FlatInstancesDimension()
            ];
            this.dimensions = [
                this.instances[0],
                this.instances[1],
                new AgentsDimension_1.AgentsDimension(this, 2),
                this.createCountersDimension()
            ];
            this.dims = [0, 1, 3, 2];
            this.countersDimIndex = 3;
        }
        GAgentDoubleWildcardQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.dimensions[2].getUrlParameters();
            return url;
        };
        GAgentDoubleWildcardQueryProvider.prototype.feedValues = function (instances, event) {
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
        GAgentDoubleWildcardQueryProvider.prototype.processData = function (response) {
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
        GAgentDoubleWildcardQueryProvider.prototype.getActions = function (index) {
            return [];
        };
        return GAgentDoubleWildcardQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GAgentDoubleWildcardQueryProvider = GAgentDoubleWildcardQueryProvider;
});

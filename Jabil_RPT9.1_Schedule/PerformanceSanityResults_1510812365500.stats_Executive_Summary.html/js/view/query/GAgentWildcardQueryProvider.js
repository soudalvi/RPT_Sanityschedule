var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/AgentsDimension", "view/query/InstancesDimension", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, AgentsDimension_1, InstancesDimension_1, qu) {
    "use strict";
    ;
    var GAgentWildcardQueryProvider = (function (_super) {
        __extends(GAgentWildcardQueryProvider, _super);
        function GAgentWildcardQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.instances = new InstancesDimension_1.InstancesDimension();
            this.dimensions = [
                this.instances,
                new AgentsDimension_1.AgentsDimension(this, 1),
                this.createCountersDimension()
            ];
            this.dims = [0, 2, 1];
            this.countersDimIndex = 2;
        }
        GAgentWildcardQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.dimensions[1].getUrlParameters();
            return url;
        };
        GAgentWildcardQueryProvider.prototype.feedValues = function (instances, event) {
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
        GAgentWildcardQueryProvider.prototype.processData = function (response) {
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
        GAgentWildcardQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(0, this.instances.items()[index[0]]);
        };
        return GAgentWildcardQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GAgentWildcardQueryProvider = GAgentWildcardQueryProvider;
});

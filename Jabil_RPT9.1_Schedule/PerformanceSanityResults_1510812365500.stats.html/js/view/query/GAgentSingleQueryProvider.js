var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/AgentsDimension", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, AgentsDimension_1, qu) {
    "use strict";
    ;
    var GAgentSingleQueryProvider = (function (_super) {
        __extends(GAgentSingleQueryProvider, _super);
        function GAgentSingleQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.dimensions = [
                this.createCountersDimension(),
                new AgentsDimension_1.AgentsDimension(this, 1),
            ];
            this.dims = [0, 1];
            this.countersDimIndex = 0;
        }
        GAgentSingleQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.dimensions[1].getUrlParameters();
            return url;
        };
        GAgentSingleQueryProvider.prototype.processData = function (response) {
            var firstTime = this.values === undefined;
            this.values = qu.values(response);
            var event = {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
            return event;
        };
        GAgentSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[0]);
        };
        return GAgentSingleQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GAgentSingleQueryProvider = GAgentSingleQueryProvider;
});

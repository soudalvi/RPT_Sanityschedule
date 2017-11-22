var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GLastQueryProvider", "view/query/queryUtil"], function (require, exports, GLastQueryProvider_1, qu) {
    "use strict";
    ;
    var GLastSingleQueryProvider = (function (_super) {
        __extends(GLastSingleQueryProvider, _super);
        function GLastSingleQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet, bounds);
            this.dimensions = [
                this.createCountersDimension(),
            ];
            this.dims = [0];
            this.countersDimIndex = 0;
        }
        GLastSingleQueryProvider.prototype.getRequestUrl = function () {
            var url = _super.prototype.getRequestUrl.call(this);
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        GLastSingleQueryProvider.prototype.processData = function (response) {
            if (response === undefined)
                throw "Empty response received from server";
            var firstTime = this.values === undefined;
            this.values = qu.values(response);
            return {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
        };
        GLastSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[0]);
        };
        return GLastSingleQueryProvider;
    }(GLastQueryProvider_1.GLastQueryProvider));
    exports.GLastSingleQueryProvider = GLastSingleQueryProvider;
});

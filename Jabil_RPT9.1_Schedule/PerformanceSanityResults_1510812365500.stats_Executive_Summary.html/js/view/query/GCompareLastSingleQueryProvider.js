var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GCompareLastQueryProvider", "view/query/queryUtil"], function (require, exports, GCompareLastQueryProvider_1, qu) {
    "use strict";
    ;
    var GCompareLastSingleQueryProvider = (function (_super) {
        __extends(GCompareLastSingleQueryProvider, _super);
        function GCompareLastSingleQueryProvider(counterQuerySet, sessions, bounds) {
            _super.call(this, counterQuerySet, sessions, bounds);
            this.dimensions = [
                this.createCountersDimension(),
                this.sessions
            ];
            this.dims = [1, 0];
            this.countersDimIndex = 0;
        }
        GCompareLastSingleQueryProvider.prototype.processData = function (response, idx) {
            if (response === undefined)
                throw "Empty response received from server";
            var firstTime = this.values === undefined;
            if (firstTime)
                this.values = new Array(this.sessions.size());
            this.values[idx] = qu.values(response);
            return {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
        };
        GCompareLastSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[0]);
        };
        return GCompareLastSingleQueryProvider;
    }(GCompareLastQueryProvider_1.GCompareLastQueryProvider));
    exports.GCompareLastSingleQueryProvider = GCompareLastSingleQueryProvider;
});

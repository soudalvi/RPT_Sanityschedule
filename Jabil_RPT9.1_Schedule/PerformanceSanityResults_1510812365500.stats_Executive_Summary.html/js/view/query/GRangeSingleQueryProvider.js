var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GRangeQueryProvider", "view/query/queryUtil"], function (require, exports, GRangeQueryProvider_1, qu) {
    "use strict";
    ;
    var GRangeSingleQueryProvider = (function (_super) {
        __extends(GRangeSingleQueryProvider, _super);
        function GRangeSingleQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
            this.dimensions = [
                this.createCountersDimension(),
                this.timeRanges,
            ];
            this.dims = [0, 1];
            this.countersDimIndex = 0;
        }
        GRangeSingleQueryProvider.prototype.processData = function (response) {
            var firstTime = this.values === undefined;
            this.values = qu.values(response);
            var event = {
                dimensionsChanged: [],
                domainChanged: true,
                dataChanged: true,
                majorChange: firstTime
            };
            if (this.timeRanges.processTimeRanges(response)) {
                event.dimensionsChanged[1] = true;
            }
            return event;
        };
        GRangeSingleQueryProvider.prototype.getActions = function (index) {
            return this.getCounterActions(index[0]);
        };
        return GRangeSingleQueryProvider;
    }(GRangeQueryProvider_1.GRangeQueryProvider));
    exports.GRangeSingleQueryProvider = GRangeSingleQueryProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Dimension", "jrptlib/Properties!APPMSG", "jrptlib/Nls"], function (require, exports, Dimension_1, APPMSG, NLS) {
    "use strict";
    function extractTimeRanges(ranges) {
        for (var i = 0; i < ranges.length; i++) {
            if (!ranges[i]) {
                ranges[i] = APPMSG.TimeRangeRun;
            }
            else {
                var name = ranges[i];
                if (name.substring(0, 12) == "#RAMP_STAGE#") {
                    ranges[i] = NLS.bind(APPMSG.AutoTimeRange, name.substring(12));
                }
            }
        }
        return ranges;
    }
    var TimeRangesDimension = (function (_super) {
        __extends(TimeRangesDimension, _super);
        function TimeRangesDimension() {
            _super.call(this);
            this.timeRanges = [];
        }
        TimeRangesDimension.prototype.name = function () {
            return APPMSG.DimTimeRanges;
        };
        TimeRangesDimension.prototype.size = function () {
            return this.timeRanges.length;
        };
        TimeRangesDimension.prototype.items = function () {
            return this.timeRanges;
        };
        TimeRangesDimension.prototype.key = function () {
            return null;
        };
        TimeRangesDimension.prototype.label = function (item, index) {
            return item;
        };
        TimeRangesDimension.prototype.processTimeRanges = function (response) {
            var oldTimeRanges = this.timeRanges;
            this.timeRanges = extractTimeRanges(response.timeRanges);
            var changed = !oldTimeRanges || this.timeRanges.length != oldTimeRanges.length;
            return changed;
        };
        return TimeRangesDimension;
    }(Dimension_1.Dimension));
    return TimeRangesDimension;
});

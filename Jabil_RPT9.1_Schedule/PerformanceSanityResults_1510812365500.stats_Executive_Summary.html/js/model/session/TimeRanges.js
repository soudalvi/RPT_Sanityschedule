define(["require", "exports", "dojo/_base/lang"], function (require, exports, lang) {
    "use strict";
    var TimeRanges = (function () {
        function TimeRanges(timeRanges, copy) {
            this.timeRanges = copy ? lang.clone(timeRanges) : timeRanges;
        }
        TimeRanges.prototype.list = function () {
            return this.timeRanges;
        };
        TimeRanges.prototype.toJson = function () {
            return this.timeRanges.map(function (tr) { return tr.toJson(); });
        };
        TimeRanges.prototype.get = function (index) {
            return this.timeRanges[index];
        };
        TimeRanges.prototype.gets = function (indices) {
            var _l = this.timeRanges;
            return indices.map(function (i) { return i == -1 ? null : _l[i]; });
        };
        TimeRanges.prototype.set = function (timeRanges) {
            this.timeRanges = timeRanges;
        };
        TimeRanges.prototype.add = function (timeRange) {
            if (!timeRange)
                throw "timeRange is null";
            this.timeRanges.push(timeRange);
        };
        TimeRanges.prototype.insert = function (index, timeRange) {
            if (index > this.timeRanges.length)
                throw "IndexOfBound";
            if (!timeRange)
                throw "timeRange is null";
            this.timeRanges.splice(index, 0, timeRange);
        };
        TimeRanges.prototype.move = function (from, to) {
            if (from == to - 1)
                return;
            var moved = this.timeRanges.splice(from, 1);
            if (from < to)
                to--;
            this.timeRanges.splice(to, 0, moved[0]);
        };
        TimeRanges.prototype.remove = function (timeRangeIndex) {
            if (timeRangeIndex >= this.timeRanges.length)
                throw "IndexOfBound";
            this.timeRanges.splice(timeRangeIndex, 1);
        };
        TimeRanges.prototype.findSameTimeRange = function (timeRange, endMatters) {
            if (timeRange == null)
                return -1;
            for (var i = 0; i < this.timeRanges.length; i++) {
                if (timeRange.isSame(this.timeRanges[i], endMatters))
                    return i;
            }
            return -2;
        };
        TimeRanges.prototype.findSameTimeRanges = function (timeRanges, endMatters) {
            var ret = [];
            for (var i = 0; i < timeRanges.length; i++) {
                var mytr = this.findSameTimeRange(timeRanges[i], endMatters);
                if (mytr != -2)
                    ret.push(mytr);
            }
            return ret.length != 0 ? ret : null;
        };
        TimeRanges.prototype.isSame = function (other) {
            if (!other)
                return false;
            var olist = other.timeRanges;
            if (this.timeRanges.length != olist.length)
                return false;
            for (var i = 0; i < this.timeRanges.length; i++) {
                if (!olist[i].isSame(this.timeRanges[i], true))
                    return false;
            }
            return true;
        };
        return TimeRanges;
    }());
    return TimeRanges;
});

define(["require", "exports", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, NLS, APPMSG) {
    "use strict";
    var TimeRange = (function () {
        function TimeRange(name, startTime, duration) {
            if (arguments.length == 0)
                return;
            if (name.substring(0, 12) == "#RAMP_STAGE#") {
                this.numUsers = +name.substring(12);
                this.name = NLS.bind(APPMSG.AutoTimeRange, name.substring(12));
            }
            else {
                this.name = name;
            }
            this.startTime = startTime;
            this.duration = duration;
        }
        TimeRange.prototype.isTillEndOfRun = function () {
            return this.duration == 0;
        };
        TimeRange.prototype.getSampleBounds = function (session) {
            var interval = session.getSampleInterval();
            var start = Math.round(this.startTime / interval);
            var end;
            if (this.duration != 0) {
                end = Math.round((this.startTime + this.duration) / interval);
            }
            return [start, end];
        };
        TimeRange.prototype.isSame = function (other, endMatters) {
            var ret = this.name == other.name
                && this.startTime == other.startTime;
            if (endMatters)
                ret = ret && this.duration == other.duration;
            return ret;
        };
        TimeRange.prototype.toJson = function () {
            var name = this.name;
            if (this.numUsers !== undefined) {
                if (this.name == NLS.bind(APPMSG.AutoTimeRange, this.numUsers)) {
                    name = "#RAMP_STAGE#" + this.numUsers;
                }
            }
            return {
                startTime: this.startTime,
                duration: this.duration,
                name: name
            };
        };
        TimeRange.fromJson = function (tr) {
            return new TimeRange(tr.name, tr.startTime ? tr.startTime : 0, tr.duration ? tr.duration : 0);
        };
        return TimeRange;
    }());
    return TimeRange;
});

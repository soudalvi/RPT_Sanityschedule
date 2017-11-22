var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var GTimeRangesProvider = (function (_super) {
        __extends(GTimeRangesProvider, _super);
        function GTimeRangesProvider() {
            _super.call(this);
        }
        GTimeRangesProvider.prototype.dispose = function () {
            this.removeSessionListeners();
        };
        GTimeRangesProvider.prototype.setSession = function (session) {
            var _this = this;
            this.removeSessionListeners();
            this.session = session;
            this._sessionListeners = [
                this.session.on("timeRangesChanged", function () { return _this.emit("changed", { intervalsChanged: true }); }),
                this.session.on("selectedTimeRangesChanged", function () { return _this.emit("changed", { intervalSelectionChanged: true }); })
            ];
        };
        GTimeRangesProvider.prototype.removeSessionListeners = function () {
            if (this._sessionListeners) {
                for (var i = 0; i < this._sessionListeners.length; i++) {
                    this._sessionListeners[i].remove();
                }
                this._sessionListeners = null;
            }
        };
        GTimeRangesProvider.prototype.intervals = function () {
            var timeRanges = this.session.timeRanges;
            if (!timeRanges)
                return [];
            return timeRanges.list();
        };
        GTimeRangesProvider.prototype.intervalKey = function () {
            return function (interval) {
                return interval.name + interval.startTime;
            };
        };
        GTimeRangesProvider.prototype.intervalStart = function (interval) {
            return interval.startTime / 1000;
        };
        GTimeRangesProvider.prototype.intervalLength = function (interval) {
            if (interval.duration === undefined)
                return 0;
            return interval.duration / 1000;
        };
        GTimeRangesProvider.prototype.intervalLabel = function (interval) {
            return interval.name;
        };
        GTimeRangesProvider.prototype.intervalSelected = function (interval, index) {
            var sel = this.session.getSelectedTimeRangeIndices();
            return sel.length == 0 || sel.indexOf(index) != -1;
        };
        return GTimeRangesProvider;
    }(Evented));
    return GTimeRangesProvider;
});

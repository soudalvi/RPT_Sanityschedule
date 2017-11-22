var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var FilterMonitor = (function (_super) {
        __extends(FilterMonitor, _super);
        function FilterMonitor(filter, manager) {
            _super.call(this);
            this.filter = filter;
            this.manager = manager;
        }
        FilterMonitor.prototype.getCounters = function () {
            return this.filter.getRequiredCounters();
        };
        FilterMonitor.prototype.exists = function () {
            for (var _i = 0, _a = this.getCounters(); _i < _a.length; _i++) {
                var c = _a[_i];
                if (this.manager.exists(c))
                    return true;
            }
            return false;
        };
        FilterMonitor.prototype.notifyExistsChanged = function () {
            this.emit("existsChanged");
        };
        FilterMonitor.prototype.startMonitoring = function (eventName) {
            if (eventName == "existsChanged") {
                this.manager.registerMonitor(this);
            }
        };
        FilterMonitor.prototype.stopMonitoring = function (eventName) {
            if (eventName == "existsChanged") {
                this.manager.unregisterMonitor(this);
            }
        };
        return FilterMonitor;
    }(Evented));
    return FilterMonitor;
});

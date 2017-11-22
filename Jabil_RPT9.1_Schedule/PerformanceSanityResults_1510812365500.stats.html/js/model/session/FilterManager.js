var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "model/counters/ReportFilter", "model/session/FilterMonitor", "view/query/GSessionRequestProvider", "jrptlib/Offline!"], function (require, exports, ReportFilter, FilterMonitor, GSessionRequestProvider, Offline) {
    "use strict";
    var MonitoredCounter = (function () {
        function MonitoredCounter() {
            this.monitors = [];
            this.exists = false;
        }
        MonitoredCounter.prototype.addMonitor = function (monitor) {
            this.monitors.push(monitor);
        };
        MonitoredCounter.prototype.removeMonitor = function (monitor) {
            var idx = this.monitors.indexOf(monitor);
            if (idx != -1) {
                this.monitors.splice(idx, 1);
            }
            return this.monitors.length == 0;
        };
        MonitoredCounter.prototype.setExists = function (exists, collectMonitors) {
            if (exists == this.exists)
                return;
            this.exists = exists;
            for (var _i = 0, _a = this.monitors; _i < _a.length; _i++) {
                var m = _a[_i];
                if (collectMonitors.indexOf(m) == -1) {
                    collectMonitors.push(m);
                }
            }
        };
        return MonitoredCounter;
    }());
    var FilterManager = (function (_super) {
        __extends(FilterManager, _super);
        function FilterManager() {
            _super.apply(this, arguments);
        }
        FilterManager.create = function () {
            if (Offline.isActivated())
                return new OfflineFilterManager();
            return new OnlineFilterManager();
        };
        FilterManager.prototype.createMonitor = function (model) {
            var filterNode = $(model).children("filter");
            if (filterNode.length == 0)
                return null;
            var filter = ReportFilter.loadFromReport(filterNode);
            return new FilterMonitor(filter, this);
        };
        FilterManager.prototype.getPostData = function () { };
        return FilterManager;
    }(GSessionRequestProvider));
    var OnlineFilterManager = (function (_super) {
        __extends(OnlineFilterManager, _super);
        function OnlineFilterManager() {
            _super.apply(this, arguments);
            this.monitored = {};
            this.monitorCount = 0;
            this.inRegisterTransaction = 0;
            this.changesSinceLastUpdate = 0;
        }
        OnlineFilterManager.prototype.enterRegister = function () {
            this.inRegisterTransaction++;
        };
        OnlineFilterManager.prototype.exitRegister = function () {
            if (--this.inRegisterTransaction == 0) {
                this.update(true);
            }
        };
        OnlineFilterManager.prototype.registerMonitor = function (monitor) {
            var countersAdded = false;
            for (var _i = 0, _a = monitor.getCounters(); _i < _a.length; _i++) {
                var c = _a[_i];
                var counter = this.monitored[c];
                if (!counter) {
                    counter = new MonitoredCounter();
                    this.monitored[c] = counter;
                    countersAdded = true;
                }
                counter.addMonitor(monitor);
            }
            if (this.monitorCount++ == 0) {
                this.setOn();
            }
            if (countersAdded)
                this.changesSinceLastUpdate++;
            this.update(true);
        };
        OnlineFilterManager.prototype.unregisterMonitor = function (monitor) {
            if (--this.monitorCount == 0) {
                this.setOff();
            }
            for (var _i = 0, _a = monitor.getCounters(); _i < _a.length; _i++) {
                var c = _a[_i];
                var counter = this.monitored[c];
                if (counter) {
                    if (counter.removeMonitor(monitor)) {
                        delete this.monitored[c];
                    }
                }
            }
        };
        OnlineFilterManager.prototype.exists = function (counter) {
            return this.monitored[counter].exists;
        };
        OnlineFilterManager.prototype.update = function (notify) {
            var updated = false;
            if (this.monitorCount != 0 && this.changesSinceLastUpdate != 0 && this.inRegisterTransaction == 0) {
                updated = _super.prototype.update.call(this, notify);
                if (updated) {
                    this.changesSinceLastUpdate = 0;
                }
            }
            return updated;
        };
        OnlineFilterManager.prototype.getRequestUrl = function () {
            this.requestedCounters = Object.keys(this.monitored);
            return this.getSessionFullPath() + "/qexists?" + this.requestedCounters.map(function (c) { return "counter=" + c; }).join("&");
        };
        OnlineFilterManager.prototype.setData = function (response) {
            var monitorsToNotify = [];
            var v = response.exist;
            for (var i = 0; i < this.requestedCounters.length; i++) {
                var counter = this.monitored[this.requestedCounters[i]];
                if (counter) {
                    counter.setExists(v[i], monitorsToNotify);
                }
            }
            for (var _i = 0, monitorsToNotify_1 = monitorsToNotify; _i < monitorsToNotify_1.length; _i++) {
                var m = monitorsToNotify_1[_i];
                m.notifyExistsChanged();
            }
        };
        return OnlineFilterManager;
    }(FilterManager));
    var OfflineFilterManager = (function (_super) {
        __extends(OfflineFilterManager, _super);
        function OfflineFilterManager() {
            _super.apply(this, arguments);
            this.counters = {};
            this.queue = [];
        }
        OfflineFilterManager.prototype.exists = function (counter) {
            return this.counters[counter];
        };
        OfflineFilterManager.prototype.enterRegister = function () {
        };
        OfflineFilterManager.prototype.exitRegister = function () {
        };
        OfflineFilterManager.prototype.registerMonitor = function (monitor) {
            if (this.queue !== null) {
                var idx = this.queue.indexOf(monitor);
                if (idx == -1)
                    this.queue.push(monitor);
            }
        };
        OfflineFilterManager.prototype.unregisterMonitor = function (monitor) {
            if (this.queue !== null) {
                var idx = this.queue.indexOf(monitor);
                if (idx != -1)
                    this.queue.splice(idx, 1);
            }
        };
        OfflineFilterManager.prototype.getRequestUrl = function () {
            return this.getSessionFullPath() + "/qexists";
        };
        OfflineFilterManager.prototype.getPostData = function () { };
        OfflineFilterManager.prototype.setData = function (response) {
            this.counters = response.exist;
            for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
                var m = _a[_i];
                m.notifyExistsChanged();
            }
            this.queue = null;
        };
        return OfflineFilterManager;
    }(FilterManager));
    return FilterManager;
});

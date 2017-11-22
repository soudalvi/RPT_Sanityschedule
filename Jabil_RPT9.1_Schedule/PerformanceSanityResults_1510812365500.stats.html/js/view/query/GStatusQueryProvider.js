var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GSessionRequestProvider", "jrptlib/Properties!APPMSG"], function (require, exports, GSessionRequestProvider, APPMSG) {
    "use strict";
    var GStatusQueryProvider = (function (_super) {
        __extends(GStatusQueryProvider, _super);
        function GStatusQueryProvider() {
            _super.call(this);
            this.regularStatus = [{ label: APPMSG.INIT, isActive: false },
                { label: APPMSG.RUNNING, isActive: false },
                { label: APPMSG.PERFORMING_DATA_TRANSFERT, isActive: false },
                { label: APPMSG.COMPLETE, isActive: false }],
                this.errorStatus = [{ label: APPMSG.COMPLETED_WITH_ERROR, isActive: false }],
                this.statuses = this.regularStatus;
        }
        GStatusQueryProvider.prototype.getRequestUrl = function () {
            return this.getSessionFullPath() + "/qlast?counter=/Run/Run Status/Cumulated&counter=/Run/Run Error Message/Cumulated";
        };
        GStatusQueryProvider.prototype.getPostData = function () { };
        GStatusQueryProvider.prototype.itemsAvailable = function () {
            return this.getDataPromise();
        };
        GStatusQueryProvider.prototype.items = function () {
            return this.statuses;
        };
        GStatusQueryProvider.prototype.getLabel = function (item) {
            if (this.isError(item)) {
                return item.label + ":" + this.errorMessage;
            }
            else {
                return item.label;
            }
        };
        GStatusQueryProvider.prototype.isActive = function (item) {
            return item.isActive;
        };
        GStatusQueryProvider.prototype.isError = function (item) {
            return (item.label.lastIndexOf(APPMSG.COMPLETED_WITH_ERROR, 0) === 0 ||
                item.label.lastIndexOf(APPMSG.STOPPED_WITH_ERROR, 0) === 0);
        };
        GStatusQueryProvider.prototype.setData = function (response, notify) {
            var prevStatus = this.rawStatus;
            if (response === undefined)
                throw "Empty response received from server";
            this.rawStatus = "INIT";
            this.errorMessage = "";
            if (response.counters !== undefined) {
                if (response.counters[0]) {
                    this.rawStatus = response.counters[0];
                }
                if (response.counters[1]) {
                    this.errorMessage = response.counters[1];
                }
            }
            if (!this.rawStatus) {
                this.rawStatus = "INIT";
            }
            this.computeStatus(this.rawStatus);
            if (prevStatus != this.rawStatus) {
                this.emit("changed", {
                    itemsChanged: true
                });
            }
        };
        GStatusQueryProvider.prototype.computeStatus = function (rawStatus) {
            switch (rawStatus) {
                case "COMPLETED_WITH_ERROR":
                    this.statuses = this.errorStatus;
                    break;
                case "STOPPED_MANUALLY":
                    this.statuses = this.regularStatus;
                    this.statuses[3].label = APPMSG.STOPPED_MANUALLY;
                    this.setStatusActive(3);
                    break;
                case "STOPPED_WITH_ERROR":
                    this.statuses = this.regularStatus;
                    this.statuses[3].label = APPMSG.STOPPED_WITH_ERROR;
                    this.setStatusActive(3);
                    break;
                case "COMPLETE":
                    this.statuses = this.regularStatus;
                    this.statuses[3].label = APPMSG.COMPLETE;
                    this.setStatusActive(3);
                    break;
                case "INIT":
                    this.statuses = this.regularStatus;
                    this.statuses[0].label = APPMSG.INIT;
                    this.setStatusActive(0);
                    break;
                case "ADDING_USERS":
                    this.statuses = this.regularStatus;
                    this.statuses[1].label = APPMSG.ADDING_USERS;
                    this.setStatusActive(1);
                    break;
                case "LAG":
                    this.statuses = this.regularStatus;
                    this.statuses[1].label = APPMSG.LAG;
                    this.setStatusActive(1);
                    break;
                case "RUNNING":
                    this.statuses = this.regularStatus;
                    this.statuses[1].label = APPMSG.RUNNING;
                    this.setStatusActive(1);
                    break;
                case "PERFORMING_DATA_TRANSFERT":
                    this.statuses = this.regularStatus;
                    this.statuses[2].label = APPMSG.PERFORMING_DATA_TRANSFERT;
                    this.setStatusActive(2);
                    break;
                default:
                    this.statuses = this.errorStatus;
                    this.statuses[0].label += rawStatus;
                    break;
            }
        };
        GStatusQueryProvider.prototype.setStatusActive = function (n) {
            for (var _i = 0, _a = this.statuses; _i < _a.length; _i++) {
                var s = _a[_i];
                s.isActive = false;
            }
            this.statuses[n].isActive = true;
        };
        GStatusQueryProvider.prototype.getActiveStatus = function () {
            var _this = this;
            var ret;
            if (this.statuses.some(function (status) {
                if (status.isActive || _this.isError(status)) {
                    ret = status.label;
                    return true;
                }
                return false;
            }, this)) {
                return ret;
            }
            else {
                return "UNKNOWN";
            }
        };
        GStatusQueryProvider.prototype.canControlExecution = function () {
            switch (this.rawStatus) {
                case "ADDING_USERS":
                case "LAG":
                case "RUNNING":
                    return true;
                default:
                    return false;
            }
        };
        return GStatusQueryProvider;
    }(GSessionRequestProvider));
    return GStatusQueryProvider;
});

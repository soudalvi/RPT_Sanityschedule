var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/ReportContentProvider"], function (require, exports, ReportContentProvider) {
    "use strict";
    var ReportFilteredContentProvider = (function (_super) {
        __extends(ReportFilteredContentProvider, _super);
        function ReportFilteredContentProvider() {
            _super.apply(this, arguments);
        }
        ReportFilteredContentProvider.prototype.inputChanged = function (view, oldInput, newInput) {
            this.viewer = view;
            if (oldInput)
                this.uninstalReport();
            if (newInput)
                this.installReport(newInput);
        };
        ReportFilteredContentProvider.prototype.installReport = function (report) {
            var _this = this;
            this.pageMonitors = [];
            report.filter_manager.enterRegister();
            try {
                for (var _i = 0, _a = report.getRootPages(); _i < _a.length; _i++) {
                    var page = _a[_i];
                    this.startPageMonitoring(page);
                }
            }
            finally {
                report.filter_manager.exitRegister();
            }
            this.reportListeners = [];
            this.reportListeners.push(report.on("pageAdded", function (page) {
                _this.startPageMonitoring(page);
            }));
            this.reportListeners.push(report.on("pageRemoved", function (page) {
                _this.stopPageMonitoring(page);
            }));
        };
        ReportFilteredContentProvider.prototype.uninstalReport = function () {
            if (this.pageMonitors) {
                $(this.pageMonitors).each(function () {
                    this.remove();
                });
                this.pageMonitors = undefined;
            }
            if (this.reportListeners) {
                $(this.reportListeners).each(function () {
                    this.remove();
                });
                this.reportListeners = undefined;
            }
        };
        ReportFilteredContentProvider.prototype.startPageMonitoring = function (page) {
            var _this = this;
            var monitor = page.startFilterMonitoring(function (page, exists) {
                _this.viewer.update();
            });
            if (monitor) {
                this.pageMonitors.push(monitor);
            }
        };
        ReportFilteredContentProvider.prototype.stopPageMonitoring = function (page) {
        };
        ReportFilteredContentProvider.prototype.getElements = function (report, handler) {
            handler(report.getRootPages().filter(function (p) { return !p.isFiltered(); }));
        };
        return ReportFilteredContentProvider;
    }(ReportContentProvider));
    return ReportFilteredContentProvider;
});

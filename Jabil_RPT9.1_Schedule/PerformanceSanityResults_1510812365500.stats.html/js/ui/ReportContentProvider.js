define(["require", "exports", "ui/Page"], function (require, exports, Page) {
    "use strict";
    var ReportContentProvider = (function () {
        function ReportContentProvider() {
        }
        ReportContentProvider.prototype.getElements = function (report, handler) {
            handler(report.getRootPages());
        };
        ReportContentProvider.prototype.hasChildren = function (item, handler) {
            if (item instanceof Page) {
                handler(item.getItems().length != 0);
            }
            else {
                handler(false);
            }
        };
        ReportContentProvider.prototype.getChildren = function (item, handler) {
            if (item instanceof Page) {
                handler(item.getItems());
            }
            else {
                handler(null);
            }
        };
        return ReportContentProvider;
    }());
    return ReportContentProvider;
});

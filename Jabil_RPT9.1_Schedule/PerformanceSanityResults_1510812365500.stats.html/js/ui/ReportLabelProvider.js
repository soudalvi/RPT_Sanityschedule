define(["require", "exports", "jrptlib/Properties!APPMSG"], function (require, exports, APPMSG) {
    "use strict";
    var ReportLabelProvider = (function () {
        function ReportLabelProvider() {
        }
        ReportLabelProvider.prototype.getText = function (item) {
            item = item.getModel();
            var checkExist = function (item, attr_1, other) {
                if ($(item).attr(attr_1) != undefined)
                    return $(item).attr(attr_1);
                else
                    return other;
            };
            if (item.nodeName == "Report")
                return checkExist(item, "name", APPMSG.Empty_Name);
            else if (item.nodeName == "Page")
                return checkExist(item, "name", APPMSG.Empty_Name);
            else if (item.nodeName == "LineChart")
                return checkExist(item, "name", APPMSG.Empty_Name);
            else if (item.nodeName == "BarChart")
                return checkExist(item, "name", APPMSG.Empty_Name);
            else if (item.nodeName == "Table")
                return checkExist(item, "name", APPMSG.Empty_Name);
            else
                return null;
        };
        ReportLabelProvider.prototype.getDescription = function (item) {
            item = item.getModel();
            if (item.nodeName == "Report")
                return $(item).attr("description");
            return null;
        };
        ReportLabelProvider.prototype.getIcon = function (item) {
            return null;
        };
        ReportLabelProvider.prototype.getCssClass = function (item) {
            item = item.getModel();
            if (item.nodeName == "Report")
                return "report_item";
            else if (item.nodeName == "Page")
                return "page_item";
            else if (item.nodeName == "LineChart")
                return "view_item lineChart";
            else if (item.nodeName == "BarChart")
                return "view_item barChart";
            else if (item.nodeName == "Table")
                return "view_item table";
            else
                return "";
        };
        return ReportLabelProvider;
    }());
    return ReportLabelProvider;
});

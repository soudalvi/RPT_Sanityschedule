define(["require", "exports"], function (require, exports) {
    "use strict";
    function path(node, name) {
        var children = $(node).children(name);
        if (children.attr("unresolved") == "true")
            return null;
        return children.attr("path");
    }
    var ReportFilter = (function () {
        function ReportFilter(requiredCounters) {
            this.requiredCounters = requiredCounters;
        }
        ReportFilter.prototype.getRequiredCounters = function () {
            return this.requiredCounters;
        };
        ReportFilter.loadFromReport = function (filterNode) {
            var required = [];
            $(filterNode).children("requiredCounters").children("CounterInfo").each(function () {
                if ($(this).attr("unresolved") != "true") {
                    required.push($(this).attr("path"));
                }
            });
            return new ReportFilter(required);
        };
        return ReportFilter;
    }());
    return ReportFilter;
});

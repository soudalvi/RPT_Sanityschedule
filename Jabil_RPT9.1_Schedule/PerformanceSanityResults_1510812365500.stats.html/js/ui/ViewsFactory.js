define(["require", "exports", "ui/PieChartView", "ui/BarChartView", "ui/LineChartView", "ui/TableView", "ui/RunStatusView", "ui/TextView"], function (require, exports, PieChartView, BarChartView, LineChartView, TableView, RunStatusView, TextView) {
    "use strict";
    var ViewsFactory = (function () {
        function ViewsFactory() {
        }
        ViewsFactory.prototype.create = function (container, page, view_id, view_node, instances) {
            var view = null;
            if (view_node.nodeName == "BarChart") {
                view = new BarChartView(container, page, view_id, view_node, instances);
            }
            else if (view_node.nodeName == "PieChart") {
                view = new PieChartView(container, page, view_id, view_node, instances);
            }
            else if (view_node.nodeName == "LineChart") {
                view = new LineChartView(container, page, view_id, view_node, instances);
            }
            else if (view_node.nodeName == "Table") {
                view = new TableView(container, page, view_id, view_node, instances);
            }
            else if (view_node.nodeName == "Text") {
                view = new TextView(container, page, view_id, view_node, instances);
            }
            else if (view_node.nodeName == "RunStatus") {
                view = new RunStatusView(container, page, view_id, view_node, instances);
            }
            else {
                _app.showErrorMessage("Error : unknown view's node name in the report model = " + view_node.nodeName);
                return null;
            }
            return view;
        };
        return ViewsFactory;
    }());
    return ViewsFactory;
});

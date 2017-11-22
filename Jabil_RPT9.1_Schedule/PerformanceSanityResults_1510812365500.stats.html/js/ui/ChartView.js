var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/QueryView", "jrptlib/Properties!APPMSG"], function (require, exports, QueryView, APPMSG) {
    "use strict";
    var ChartView = (function (_super) {
        __extends(ChartView, _super);
        function ChartView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.showLegend = true;
            this.setClassName("chart-view");
            this.legendVisibility = $(this.getModel()).attr("legendVisibility") || "top";
            this.scaleOnSelection = !($(this.getModel()).attr("scaleOnSelection") === "false");
            this.legend = document.createElement('div');
            $(this.legend).addClass("chart-legend");
            $(this.legend).appendTo(this.getContents());
            this.chart = document.createElement('div');
            $(this.chart).addClass("chart-area");
            $(this.chart).appendTo(this.getContents());
        }
        ChartView.prototype.createContents = function (parent) {
            this.updateLegend();
            this.createLegend(this.legend);
            $(this.chart).height(Math.round(this.getW() / this.getRatio()));
            this.createChart(this.chart);
            this.chartCreated = true;
        };
        ChartView.prototype.clearContents = function () {
            $(this.chart).children().each(function (idx) {
                $(this).remove();
            });
            $(this.legend).children().each(function (idx) {
                $(this).remove();
            });
        };
        ChartView.prototype.resizedContents = function (parent) {
            if (this.chartCreated) {
                this.resizedChart($(parent).find(".chart-area")[0]);
            }
        };
        ChartView.prototype.setSize = function () {
            if (this.getRatio() != -1) {
                var h = Math.round(this.getW() / this.getRatio());
                $(this.getContents()).find(".chart-area").height(h);
            }
        };
        ChartView.prototype.updateLegend = function (old_value) {
            var value = this.getLegendVisibility();
            if (value === "hidden") {
                $(this.getContainer()).find(".chart-legend").hide();
                return;
            }
            $(this.getContainer()).find(".chart-legend").show();
            if (old_value) {
                $(this.getContainer()).find(".chart-legend").removeClass("chart-legend-" + old_value);
            }
            $(this.getContainer()).find(".chart-legend").addClass("chart-legend-" + value);
            if (value == "bottom") {
                $(this.getContainer()).find(".chart-legend").insertAfter($(this.getContainer()).find(".chart-area"));
            }
            else if (value == "top") {
                $(this.getContainer()).find(".chart-legend").insertBefore($(this.getContainer()).find(".chart-area"));
            }
        };
        ChartView.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            _super.prototype.createOptions.call(this, provider, counterProvider);
            provider.addOption({ label: APPMSG.LegendVisibility_label,
                type: "SELECT",
                id: "legendVisibility",
                values: function () {
                    return [
                        { value: "top", label: APPMSG.LegendVisibility_top },
                        { value: "bottom", label: APPMSG.LegendVisibility_bottom },
                        { value: "hidden", label: APPMSG.LegendVisibility_none }];
                },
                value: function () {
                    return _this.getLegendVisibility();
                },
                change: function (value, save) {
                    _this.setLegendVisibility(value, save);
                }
            });
            provider.addOption({ label: APPMSG.ScaleOnSelection_label,
                type: "BOOLEAN",
                id: "scaleOnSelection",
                value: function () {
                    return _this.isScaleOnSelection();
                },
                change: function (value, save) {
                    _this.setScaleOnSelection(value, save);
                }
            });
        };
        ChartView.prototype.getLegendVisibility = function () {
            return this.legendVisibility;
        };
        ChartView.prototype.setLegendVisibility = function (value, save) {
            var oldvalue = $(this.getModel()).attr("legendVisibility");
            this.legendVisibility = value;
            if (save)
                $(this.getModel()).attr("legendVisibility", value);
            this.updateLegend(oldvalue);
        };
        ChartView.prototype.setScaleOnSelection = function (value, save) {
            if (save)
                $(this.getModel()).attr("scaleOnSelection", value.toString());
            this.scaleOnSelection = value;
            this.refreshContents();
        };
        ChartView.prototype.isScaleOnSelection = function () {
            return this.scaleOnSelection;
        };
        return ChartView;
    }(QueryView));
    return ChartView;
});

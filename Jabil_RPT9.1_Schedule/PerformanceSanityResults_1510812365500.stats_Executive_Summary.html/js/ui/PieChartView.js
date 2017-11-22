var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/ChartView", "view/GPie", "view/GError", "view/query/QueryFactory"], function (require, exports, ChartView, GPie_1, GError, QueryFactory_1) {
    "use strict";
    var PieChartView = (function (_super) {
        __extends(PieChartView, _super);
        function PieChartView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setRatio(2);
        }
        PieChartView.prototype.getSeries = function () {
            return GPie_1.PieSeries;
        };
        PieChartView.prototype.getQueryFactory = function () {
            return this.provider;
        };
        PieChartView.prototype.createChartAndProviders = function () {
            try {
                this.provider = new QueryFactory_1.PieQueryFactory(this.getCounterQuerySet(), this.getSession());
                this.setupBusy(this.provider.getQueryProvider());
                this.pieChart = new GPie_1.GPie(this.provider.getViewProvider(), this.computeGPieOptions(this.provider));
            }
            catch (error) {
                this.pieChart = new GError(error);
            }
        };
        PieChartView.prototype.computeGPieOptions = function (provider) {
            return {
                dimensions: provider.getSeriesOptions(this.getSeriesOptions()),
                donut: false
            };
        };
        PieChartView.prototype.createContents = function (parent) {
            var _this = this;
            this.createChartAndProviders();
            this.sessionListeners = [
                this.getSession().on("selectedTimeRangesChanged", function () { return _this.refreshContents(); }),
                this.getSession().sessionSet.on("selectionChanged", function () { return _this.refreshContents(); }),
                this.getSession().on("hosts", function (details) {
                    if (details.compareChanged)
                        _this.refreshContents();
                })
            ];
            _super.prototype.createContents.call(this, parent);
        };
        PieChartView.prototype.clearContents = function () {
            _super.prototype.clearContents.call(this);
            if (this.provider) {
                this.provider.dispose();
                this.provider = null;
            }
            for (var i = 0; i < this.sessionListeners.length; i++)
                this.sessionListeners[i].remove();
            this.sessionListeners = undefined;
            this.pieChart = null;
        };
        PieChartView.prototype.createLegend = function (parent) {
            this.pieChart.renderLegend(d3.select(parent));
        };
        PieChartView.prototype.createChart = function (parent) {
            var w = $(parent).width();
            var h = $(parent).height();
            this.pieChart.renderContents(d3.select(parent), w, h);
        };
        PieChartView.prototype.resizedChart = function (parent) {
            if (this.pieChart) {
                var w = $(parent).width();
                var h = $(parent).height();
                this.pieChart.resize(w, h);
            }
        };
        return PieChartView;
    }(ChartView));
    return PieChartView;
});

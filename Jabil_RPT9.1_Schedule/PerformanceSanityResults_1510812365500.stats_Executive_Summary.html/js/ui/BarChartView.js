var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/ChartView", "view/GBars", "view/GError", "view/query/QueryFactory", "jrptlib/Properties!APPMSG"], function (require, exports, ChartView, GBars_1, GError, QueryFactory_1, APPMSG) {
    "use strict";
    var BarChartView = (function (_super) {
        __extends(BarChartView, _super);
        function BarChartView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setRatio(3);
            this.scalePer = $(view_node).attr("scalePer");
            this.valueDetailsMode = $(view_node).attr("valueDetailsMode") || "hover";
        }
        BarChartView.prototype.getSeries = function () {
            return GBars_1.BarSeries;
        };
        BarChartView.prototype.getQueryFactory = function () {
            return this.provider;
        };
        BarChartView.prototype.createChartAndProviders = function () {
            var _this = this;
            try {
                this.provider = new QueryFactory_1.BarsQueryFactory(this.getCounterQuerySet(), this.getSession());
                this.provider.scalePer(this.scalePer);
                var qp = this.provider.getQueryProvider();
                qp.on("drilldownChanged", function () { return _this.drilldownChanged(); });
                qp.getInstanceDrilldownActions = function (instances) {
                    return _this.getDrilldownActions(instances);
                };
                this.setupBusy(qp);
                this.barChart = new GBars_1.GBars(this.provider.getViewProvider(), this.computeGBarsOptions(this.provider));
            }
            catch (error) {
                this.barChart = new GError(error);
            }
        };
        BarChartView.prototype.drilldownChanged = function () {
            var stack = this.provider.getQueryProvider().getDrilldownStack().slice(1);
            this.setDrilldownTitle(stack.map(function (cqs) {
                return cqs.label;
            }));
            this.updateLegend();
        };
        BarChartView.prototype.pathClicked = function (index) {
            this.provider.getQueryProvider().popCounterQuerySet(index);
        };
        BarChartView.prototype.computeGBarsOptions = function (provider) {
            return {
                scaleOnSelection: this.isScaleOnSelection(),
                tickStyle: "tick",
                valueDetailsMode: this.valueDetailsMode,
                dimensions: provider.getSeriesOptions(this.getSeriesOptions())
            };
        };
        BarChartView.prototype.createContents = function (parent) {
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
        BarChartView.prototype.clearContents = function () {
            _super.prototype.clearContents.call(this);
            for (var i = 0; i < this.sessionListeners.length; i++)
                this.sessionListeners[i].remove();
            this.sessionListeners = undefined;
            if (this.provider) {
                this.provider.dispose();
                this.provider = null;
                this.setDrilldownTitle([]);
            }
            this.barChart = null;
        };
        BarChartView.prototype.createLegend = function (parent) {
            this.barChart.renderLegend(d3.select(parent));
        };
        BarChartView.prototype.createChart = function (parent) {
            var _this = this;
            var w = $(parent).width();
            var h = $(parent).height();
            if (this.barChart instanceof GBars_1.GBars) {
                this.barChart.on("resizeNeeded", function (newSize) {
                    var h = $(parent).height();
                    if (newSize[1] > h) {
                        $(_this.getContents()).find(".chart-area").height(newSize[1]);
                    }
                });
            }
            this.barChart.renderContents(d3.select(parent), w, h);
        };
        BarChartView.prototype.resizedChart = function (parent) {
            if (this.barChart) {
                var w = $(parent).width();
                var h = $(parent).height();
                var newSize = this.barChart.resize(w, h);
                if (newSize[1] > h) {
                    $(this.getContents()).find(".chart-area").height(newSize[1]);
                }
            }
        };
        BarChartView.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            _super.prototype.createOptions.call(this, provider, counterProvider);
            provider.addOption({ label: APPMSG.ScalePer,
                type: "SELECT",
                id: "scalePer",
                values: function () { return [{ value: null, label: APPMSG.PerUnit }].concat(_this.provider ? _this.provider.getAcceptableDimensions(counterProvider, QueryFactory_1.LabelKind.SINGULAR) : []); },
                value: function () { return _this.getScalePer(); },
                change: function (value, save) { return _this.setScalePer(value, save); }
            });
            provider.addOption({ label: APPMSG.ValueDetailsMode,
                type: "SELECT",
                id: "valueDetailsMode",
                values: function () { return [{ value: "never", label: APPMSG.ValueDetailsNever }, { value: "hover", label: APPMSG.ValueDetailsHover }, { value: "always", label: APPMSG.ValueDetailsAlways }]; },
                value: function () { return _this.getValueDetailsMode(); },
                change: function (value, save) { return _this.setValueDetailsMode(value, save); }
            });
        };
        BarChartView.prototype.getScalePer = function () {
            return this.scalePer;
        };
        BarChartView.prototype.setScalePer = function (dim, save) {
            if (save)
                $(this.getModel()).attr("scalePer", dim);
            this.scalePer = dim;
            this.refreshContents();
        };
        BarChartView.prototype.getValueDetailsMode = function () {
            return this.valueDetailsMode;
        };
        BarChartView.prototype.setValueDetailsMode = function (mode, save) {
            if (save)
                $(this.getModel()).attr("valueDetailsMode", mode);
            this.valueDetailsMode = mode;
            this.refreshContents();
        };
        return BarChartView;
    }(ChartView));
    return BarChartView;
});

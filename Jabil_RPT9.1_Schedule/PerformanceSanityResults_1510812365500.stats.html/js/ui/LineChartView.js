var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ui/ChartView", "view/GLines", "view/GError", "view/query/QueryFactory", "view/query/GTimeRangesProvider", "jrptlib/Properties!APPMSG"], function (require, exports, ChartView, GLines_1, GError, QueryFactory_1, GTimeRangesProvider, APPMSG) {
    "use strict";
    var LineChartView = (function (_super) {
        __extends(LineChartView, _super);
        function LineChartView(container, page, view_id, view_node, instances) {
            _super.call(this, container, page, view_id, view_node, instances);
            this.setClassName("linechart-view");
            this.setRatio(1.9);
            this.scaleOnZoomedData = !($(this.getModel()).attr("scaleOnZoomedData") === "false");
            this.timeMode = $(this.getModel()).attr("timeMode") || "relative";
            this.showTimeRanges = !($(this.getModel()).attr("showTimeRanges") === "false");
            this.lineSmoothing = !($(this.getModel()).attr("lineSmoothing") === "false");
            this.timelineVisibility = $(this.getModel()).attr("timelineVisibility");
            this.scalePer = $(view_node).attr("scalePer");
        }
        LineChartView.prototype.getSeries = function () {
            return GLines_1.LineSeries;
        };
        LineChartView.prototype.getQueryFactory = function () {
            return this.provider;
        };
        LineChartView.prototype.createChartAndProviders = function () {
            var _this = this;
            try {
                this.provider = new QueryFactory_1.LineQueryFactory(this.getCounterQuerySet(), this.getSession(), this.computeProviderOptions());
                this.provider.scalePer(this.scalePer);
                this.options = this.computeGLinesOptions(this.provider);
                this.timeRangesProvider = this.computeTimeRangeProvider();
                this.lineChart = new GLines_1.GLines(this.provider.getViewProvider(), this.options, this.timeRangesProvider);
                this.provider.getViewProvider().on("changed", function (event) {
                    if (event.xDomainChanged)
                        _this.xDomainChanged();
                });
                this.setupBusy(this.provider.getQueryProvider());
            }
            catch (error) {
                this.lineChart = new GError(error);
            }
        };
        LineChartView.prototype.computeTimeRangeProvider = function () {
            if (this.isShowTimeRanges()) {
                return new GTimeRangesProvider();
            }
            return null;
        };
        LineChartView.prototype.computeGLinesOptions = function (provider) {
            return {
                dimensions: provider.getSeriesOptions(this.getSeriesOptions()),
                timeLine: this.getTimeLineVisibility(),
                scaleOnSelection: this.isScaleOnSelection(),
                lineSmoothing: this.isLineSmoothing(),
                tickStyle: ["tick", "tick"],
                detailMode: ["projection", "projection"]
            };
        };
        LineChartView.prototype.computeProviderOptions = function () {
            return {
                scaleOnZoomedData: this.scaleOnZoomedData,
                absoluteTime: this.timeMode == "absolute"
            };
        };
        LineChartView.prototype.createContents = function (parent) {
            var _this = this;
            this.createChartAndProviders();
            if (this.timeRangesProvider) {
                this.timeRangesProvider.setSession(this.getSession());
            }
            this.sessionListeners = [
                this.getSession().sessionSet.on("selectionChanged", function () { return _this.refreshContents(); }),
                this.getSession().on("hosts", function (details) {
                    if (details.compareChanged)
                        _this.refreshContents();
                })
            ];
            _super.prototype.createContents.call(this, parent);
        };
        LineChartView.prototype.clearContents = function () {
            _super.prototype.clearContents.call(this);
            for (var i = 0; i < this.sessionListeners.length; i++)
                this.sessionListeners[i].remove();
            this.sessionListeners = undefined;
            if (this.provider) {
                this.provider.dispose();
                if (this.timeRangesProvider) {
                    this.timeRangesProvider.dispose();
                    this.timeRangesProvider = null;
                }
                this.provider = null;
            }
            this.lineChart = null;
        };
        LineChartView.prototype.createLegend = function (parent) {
            this.lineChart.renderLegend(d3.select(parent));
        };
        LineChartView.prototype.createChart = function (parent) {
            var w = $(parent).width();
            var h = $(parent).height();
            var newSize = this.lineChart.renderContents(d3.select(parent), w, h);
            if (newSize[1] > h) {
                h = newSize[1];
                $(this.getContents()).find(".chart-area").height(h);
            }
            var char = $(parent).find(".linechart");
            this.timeRangeAddButton = $("<button>").addClass("timerange-add")
                .addClass("ui-button")
                .append("<div class=\"ui-icon\"></div>")
                .css({ position: "relative", top: (-h + 20) + "px", right: 15 + "px" })
                .hide()
                .appendTo($(parent))
                .click(function () {
                var interval = $(this).data("timerange");
                _app.getTimeRangeSelector().openTimeRangeDialog(function () {
                    _app.getTimeRangeSelector().getTimeRangeDialog().add({
                        name: APPMSG.NewTimeRange,
                        start: interval[0] * 1000,
                        end: interval[1] * 1000
                    });
                });
            });
        };
        LineChartView.prototype.resizedChart = function (parent) {
            if (this.lineChart) {
                var w = $(parent).width();
                var h = $(parent).height();
                var newSize = this.lineChart.resize(w, h);
                if (newSize && newSize[1] > h) {
                    h = newSize[1];
                    $(this.getContents()).find(".chart-area").height(h);
                }
            }
            if (this.timeRangeAddButton) {
                $(this.timeRangeAddButton).css({ position: "relative", top: (-h + 20) + "px", right: 15 + "px" });
            }
        };
        LineChartView.prototype.createOptions = function (provider, counterProvider) {
            var _this = this;
            _super.prototype.createOptions.call(this, provider, counterProvider);
            provider.addOption({ label: APPMSG.ScaleOnZoomedData_label,
                type: "BOOLEAN",
                id: "scaleOnZoomedData",
                value: function () { return _this.isScaleOnZoomedData(); },
                change: function (value, save) { return _this.setScaleOnZoomedData(value, save); }
            });
            provider.addOption({ label: APPMSG.ShowTimeRanges_label,
                type: "BOOLEAN",
                id: "showtimerange",
                value: function () { return _this.isShowTimeRanges(); },
                change: function (value, save) { return _this.setShowTimeRanges(value, save); }
            });
            provider.addOption({ label: APPMSG.TimeMode_label,
                type: "SELECT",
                id: "timemode",
                values: function () { return [{ value: "relative", label: APPMSG.TimeMode_relative },
                    { value: "absolute", label: APPMSG.TimeMode_absolute }]; },
                value: function () { return _this.getTimeMode(); },
                change: function (value, save) { return _this.setTimeMode(value, save); }
            });
            provider.addOption({ label: APPMSG.LineSmoothing_label,
                type: "BOOLEAN",
                id: "lineSmoothing",
                value: function () { return _this.isLineSmoothing(); },
                change: function (value, save) { return _this.setLineSmoothing(value, save); }
            });
            provider.addOption({ label: APPMSG.TimelineVisibility_label,
                type: "SELECT",
                id: "timelineVisibility",
                values: function () { return [{ value: "none", label: APPMSG.TimeLineVisibility_none },
                    { value: "small", label: APPMSG.TimeLineVisibility_small },
                    { value: "full", label: APPMSG.TimeLineVisibility_full }]; },
                value: function () { return _this.getTimeLineVisibility(); },
                change: function (value, save) { return _this.setTimelineVisibility(value, save); }
            });
            provider.addOption({ label: APPMSG.ScalePer,
                type: "SELECT",
                id: "scalePer",
                values: function () { return [{ value: null, label: APPMSG.PerUnit }].concat(_this.provider ? _this.provider.getAcceptableDimensions(counterProvider, QueryFactory_1.LabelKind.SINGULAR) : []); },
                value: function () { return _this.getScalePer(); },
                change: function (value, save) { return _this.setScalePer(value, save); }
            });
        };
        LineChartView.prototype.getTimeLineVisibility = function () {
            var attr = this.timelineVisibility;
            if (attr == undefined) {
                var cqSet = this.getCounterQuerySet();
                var wildcards = cqSet.getWildcards();
                attr = cqSet.counterQueries.length > 1 ||
                    (wildcards != null && wildcards.length > 0) ? "full" : "small";
                return attr;
            }
            return attr;
        };
        LineChartView.prototype.setTimelineVisibility = function (value, save) {
            if (save)
                $(this.getModel()).attr("timelineVisibility", value);
            this.timelineVisibility = value;
            this.refreshContents();
        };
        LineChartView.prototype.setShowTimeRanges = function (value, save) {
            if (save)
                $(this.getModel()).attr("showTimeRanges", value.toString());
            this.showTimeRanges = value;
            this.refreshContents();
        };
        LineChartView.prototype.isShowTimeRanges = function () {
            return this.showTimeRanges;
        };
        LineChartView.prototype.setLineSmoothing = function (value, save) {
            if (save)
                $(this.getModel()).attr("lineSmoothing", value.toString());
            this.lineSmoothing = value;
            if (this.lineChart instanceof GLines_1.GLines) {
                this.lineChart.setLineSmoothing(value);
            }
        };
        LineChartView.prototype.isLineSmoothing = function () {
            return this.lineSmoothing;
        };
        LineChartView.prototype.setScaleOnZoomedData = function (value, save) {
            if (save)
                $(this.getModel()).attr("scaleOnZoomedData", value.toString());
            this.scaleOnZoomedData = value;
            this.refreshContents();
        };
        LineChartView.prototype.isScaleOnZoomedData = function () {
            return this.scaleOnZoomedData;
        };
        LineChartView.prototype.setTimeMode = function (value, save) {
            if (save)
                $(this.getModel()).attr("timeMode", value);
            this.timeMode = value;
            this.refreshContents();
        };
        LineChartView.prototype.getTimeMode = function () {
            return this.timeMode;
        };
        LineChartView.prototype.getScalePer = function () {
            return this.scalePer;
        };
        LineChartView.prototype.setScalePer = function (dim, save) {
            if (save)
                $(this.getModel()).attr("scalePer", dim);
            this.scalePer = dim;
            this.refreshContents();
        };
        LineChartView.prototype.xDomainChanged = function () {
            if (_app.isOffline())
                return;
            if (this.provider.getQueryProvider().getXDomain() != null) {
                $(this.timeRangeAddButton).attr("title", APPMSG.CreateTimeRange);
                $(this.timeRangeAddButton).show();
                this.timeRangeAddButton.data("timerange", this.provider.getQueryProvider().getXDomain());
            }
            else {
                $(this.timeRangeAddButton).attr("title", "");
                $(this.timeRangeAddButton).hide();
                this.timeRangeAddButton.data("timerange", null);
            }
        };
        return LineChartView;
    }(ChartView));
    return LineChartView;
});

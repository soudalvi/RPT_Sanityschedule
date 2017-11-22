var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "view/GLegend", "view/util/DimensionUtil", "view/prov/GOrnamentProviders", "view/comps/SeriesAxis", "view/comps/ValuesAxis", "view/comps/BarsContent", "view/util/FilterableMatrixProvider", "view/util/OrnamentProviders", "../jrptlib/PopupMenu", "../jrptlib/Tooltip", "../jrptlib/Nls", "view/util/Margin", "jrptlib/Properties!APPMSG"], function (require, exports, Evented, GLegend_1, du, GOrnamentProviders_1, SeriesAxis_1, ValuesAxis_1, BarsContent, FilterableMatrixProvider_1, OrnamentProviders_1, PopupMenu, Tooltip, NLS, Margin, APPMSG) {
    "use strict";
    exports.BarSeries = {
        ids: ["primary", "secondary", "stack"],
        labels: [APPMSG.PrimaryBarSerie, APPMSG.SecondaryBarSerie, APPMSG.StackBarSerie]
    };
    var GBarsOptions = (function () {
        function GBarsOptions() {
            this.tickStyle = "tick";
        }
        return GBarsOptions;
    }());
    exports.GBarsOptions = GBarsOptions;
    function ornamentKinds(options) {
        if (options.series[1] != null) {
            if (options.series[2] != null) {
                return [null, GOrnamentProviders_1.GOrnamentKind.COLOR_SHADEABLE, GOrnamentProviders_1.GOrnamentKind.SHADE];
            }
            else {
                return [null, GOrnamentProviders_1.GOrnamentKind.COLOR, null];
            }
        }
        else if (options.series[2] != null) {
            return [null, null, GOrnamentProviders_1.GOrnamentKind.COLOR];
        }
        else if (options.series[0] != null) {
            return [null, null, null];
        }
        return [null, null, null];
    }
    var GBars = (function (_super) {
        __extends(GBars, _super);
        function GBars(provider, options) {
            _super.call(this);
            if (options.scaleOnSelection === undefined)
                options.scaleOnSelection = true;
            var dimOptions = options.dimensions;
            dimOptions.validate(provider.dimensionsCount());
            provider = du.swap(provider, dimOptions.series);
            this.ornamentMatrix = new OrnamentProviders_1.OrnamentMatrix(provider, ornamentKinds(dimOptions));
            if (dimOptions.useLegend()) {
                this.provider = new FilterableMatrixProvider_1.FilterableTabularProvider(provider, dimOptions.legends, options.scaleOnSelection, this.ornamentMatrix);
            }
            else {
                this.provider = provider;
            }
            this.options = options;
        }
        GBars.prototype.getLegendProvider = function (dim) {
            var p = this.provider;
            if (p instanceof FilterableMatrixProvider_1.FilterableTabularProvider)
                return p.legendDimension(dim);
            return null;
        };
        GBars.prototype.renderLegend = function (parentDiv) {
            this.legendDiv = parentDiv;
            this.legend = [];
            var lps = [];
            var lpCount = 0;
            for (var i = 0; i < this.provider.dimensionsCount(); i++) {
                if (lps[i] = this.getLegendProvider(i))
                    lpCount++;
            }
            for (var i = 0; i < this.provider.dimensionsCount(); i++) {
                var lp = lps[i];
                if (lp) {
                    this.legend[i] = GLegend_1.GLegend.create(lp, this.ornamentMatrix.ornament(i), new GLegend_1.GLegendOptions({ showTitle: lpCount > 1 }));
                    this.legend[i].renderContents(parentDiv);
                }
            }
        };
        GBars.prototype.resize = function (w, h, notify, animate) {
            this.size = [w, h];
            var width = this.margin.netWidth(w);
            var height = this.margin.netHeight(h);
            if (this.seriesAxis.setWidth(width)) {
                this.marginChanged(notify, animate);
            }
            else {
                this.valuesAxis.setSize(width, height, animate);
                if (this.valuesAxis.renderSize[1] > height) {
                    this.size[1] += this.valuesAxis.renderSize[1] - height;
                    h = this.size[1];
                    height = this.valuesAxis.renderSize[1];
                }
                this.seriesAxis.setHeight(height);
                this.barsContent.setSize(width, height, animate);
                this.svg.attr("viewBox", "0 0 " + w + " " + h)
                    .attr("style", "height:" + h + "px");
            }
            return this.size;
        };
        GBars.prototype.highlightLegend = function (indices) {
            if (!this.legend)
                return;
            for (var i = 0; i < 3; i++) {
                var lp = this.getLegendProvider(i);
                if (lp) {
                    if (indices[i] != -1) {
                        var legendIndex = lp.sourceIndex(indices[i]);
                        this.legend[i].highlight(legendIndex);
                    }
                    else {
                        this.legend[i].clearHighlight();
                    }
                }
            }
        };
        GBars.prototype.mouseToIndices = function (event) {
            var kC = d3.mouse(this.svg.node());
            var mouseX = kC[0] - this.margin.left;
            var mouseY = kC[1] - this.margin.top;
            if (mouseY < 0 && mouseY > this.size[1])
                return null;
            var indices = this.seriesAxis.resolve(mouseX);
            if (indices) {
                indices[2] = this.barsContent.tertiaryIndex(mouseY, indices[0], indices[1]);
            }
            return indices;
        };
        GBars.prototype.handleMouseOverGraph = function () {
            var indices = this.mouseToIndices(d3.event);
            if (indices) {
                this.highlightLegend(indices);
                var showValueInTooltip = false;
                if (indices[2] != -1) {
                    showValueInTooltip = this.options.valueDetailsMode != "hover" || !this.barsContent.showValue(indices);
                    var unitIndex = this.provider.dataUnit(indices);
                    this.valuesAxis.highlightAxes([unitIndex]);
                }
                else {
                    this.barsContent.hideValue();
                }
                this.showTooltip(indices, showValueInTooltip);
                return;
            }
            else {
                this.handleMouseOutGraph();
            }
        };
        GBars.prototype.handleMouseOutGraph = function () {
            this.barsContent.hideValue();
            if (this.tooltip)
                this.tooltip.hide();
            this.highlightLegend([-1, -1, -1]);
            this.valuesAxis.highlightAxes([]);
        };
        GBars.prototype.handleMouseClickInGraph = function () {
            var event = d3.event;
            var indices = this.mouseToIndices(event);
            if (indices && indices[2] != -1) {
                var actions = this.provider.getActions(indices);
                if (actions && actions.length > 0) {
                    this.popupMenu = new PopupMenu();
                    this.popupMenu.setActions(actions);
                    this.popupMenu.openPopupMenu(event);
                    this.popupMenu.positionMenu(event.pageX, event.pageY);
                }
            }
            else {
                if (this.popupMenu) {
                    this.popupMenu.closePopupMenu();
                    this.popupMenu = null;
                }
            }
        };
        GBars.prototype.getFilteredOrnamentMatrix = function () {
            if (this.provider instanceof FilterableMatrixProvider_1.FilterableTabularProvider) {
                return this.provider;
            }
            return this.ornamentMatrix;
        };
        GBars.prototype.computeMargin = function () {
            this.margin = new Margin(20, 10, 10, 10)
                .add(this.valuesAxis.computeMargin())
                .add(this.seriesAxis.computeMargin());
        };
        GBars.prototype.renderContents = function (parentDiv, w, h) {
            var _this = this;
            this.size = [w, h];
            var chart = parentDiv.append("div")
                .attr("class", "barchart graph");
            this.svg = chart.append("svg")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("style", "height:" + h + "px");
            this.seriesAxis = new SeriesAxis_1.SeriesAxis(this.provider);
            this.valuesAxis = new ValuesAxis_1.VerticalValuesAxis(du.consolidateDimension(this.provider, 2), ValuesAxis_1.tickStyle(this.options.tickStyle), false);
            this.barsContent = new BarsContent(this.provider, this.getFilteredOrnamentMatrix(), this.seriesAxis, this.valuesAxis, this.options.valueDetailsMode == "always");
            this.computeMargin();
            var width = this.margin.netWidth(w);
            var height = this.margin.netHeight(h);
            var graph = this.svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
            if (this.seriesAxis.renderContents(graph, width, height)) {
                this.computeMargin();
                height = this.margin.netHeight(h);
            }
            this.valuesAxis.setSize(width, height, false);
            this.valuesAxis.renderContents(graph);
            if (this.valuesAxis.renderSize[1] > height) {
                this.size[1] += this.valuesAxis.renderSize[1] - height;
                height = this.valuesAxis.renderSize[1];
            }
            this.seriesAxis.setHeight(height);
            this.barsContent.renderContents(graph, width, height);
            this.svg.on("mouseleave", function () { return _this.handleMouseOutGraph(); });
            this.svg.on("mousemove", function () { return _this.handleMouseOverGraph(); });
            this.svg.on("click", function () { return _this.handleMouseClickInGraph(); });
            this.provider.on("changed", function (event) { return _this.processChange(event); });
            return this.size;
        };
        GBars.prototype.processChange = function (event) {
            var marginImpacted = this.seriesAxis.processChange(event);
            if (this.valuesAxis.processChange(event))
                marginImpacted = true;
            this.barsContent.processChange(event);
            if (marginImpacted)
                this.marginChanged(true, !event.majorChange);
        };
        GBars.prototype.marginChanged = function (notify, animate) {
            this.computeMargin();
            this.resize(this.size[0], this.size[1], notify, animate);
            if (notify)
                this.emit("resizeNeeded", this.size);
        };
        GBars.prototype.showTooltip = function (index, showValue) {
            if (this.tooltip == undefined) {
                this.tooltip = new Tooltip(this.svg, this.size[1]);
            }
            else {
                this.tooltip.setHeight(this.size[1]);
            }
            this.tooltip.hide();
            var p0 = this.provider.dimension(0);
            var tooltipText = p0.label(p0.items()[index[0]], index[0]);
            if (showValue) {
                var val = this.provider.data(index);
                var valueText = this.provider.dataText(val, index);
                if (tooltipText == "")
                    tooltipText = valueText;
                tooltipText = NLS.bind("{0} ({1})", [tooltipText, valueText]);
            }
            if (tooltipText == "")
                return;
            this.tooltip.show(tooltipText);
        };
        return GBars;
    }(Evented));
    exports.GBars = GBars;
});

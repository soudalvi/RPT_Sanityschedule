define(["require", "exports", "view/GLegend", "view/prov/GOrnamentProviders", "view/comps/ValuesAxis", "view/comps/LinesContent", "view/comps/TimeLine", "view/comps/Projections", "view/comps/Brush", "view/comps/IntervalsContent", "view/util/DimensionUtil", "view/util/FilterableMatrixProvider", "view/util/LineToXProvider", "view/util/OrnamentProviders", "jrptlib/Properties!APPMSG", "view/util/Margin"], function (require, exports, GLegend_1, GOrnamentProviders_1, ValuesAxis_1, LinesContent, TimeLine, Projections, Brush, IntervalsContent, du, FilterableMatrixProvider_1, LineToXProvider, OrnamentProviders_1, APPMSG, Margin) {
    "use strict";
    exports.LineSeries = {
        ids: ["primary", "secondary"],
        labels: [APPMSG.PrimaryLineSerie, APPMSG.SecondaryLineSerie]
    };
    var GLinesOptions = (function () {
        function GLinesOptions() {
            this.lineSmoothing = true;
            this.scaleOnSelection = true;
            this.tickStyle = ["tick", "tick"];
            this.detailMode = ["off", "projection"];
        }
        return GLinesOptions;
    }());
    exports.GLinesOptions = GLinesOptions;
    function isVariableProvider(object) {
        return 'getFixedProvider' in object;
    }
    function extractDim(lines, dim) {
        switch (dim) {
            case 0: return extractDim1(lines);
            case 1: return extractDim2(lines);
            default: throw dim;
        }
    }
    function extractDim1(lines) {
        var ret = [];
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (l && l.length)
                ret.push(i);
        }
        return ret;
    }
    function extractDim2(lines) {
        var ret = [];
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (!l)
                continue;
            for (var j = 0; j < l.length; j++) {
                if (l[j] && ret.indexOf(j) == -1)
                    ret.push(j);
            }
        }
        return ret;
    }
    ;
    var GLines = (function () {
        function GLines(provider, options, intervalsProvider) {
            if (options.scaleOnSelection === undefined)
                options.scaleOnSelection = true;
            if (options.lineSmoothing === undefined)
                options.lineSmoothing = true;
            var dimOptions = options.dimensions;
            dimOptions.validate(provider.dimensionsCount());
            provider = du.swapLine(provider, dimOptions.series);
            this.ornamentMatrix = new OrnamentProviders_1.OrnamentMatrix(provider, [GOrnamentProviders_1.GOrnamentKind.COLOR, GOrnamentProviders_1.GOrnamentKind.STROKE]);
            if (dimOptions.useLegend()) {
                this.provider = isVariableProvider(provider) ?
                    new FilterableMatrixProvider_1.FilterableVariableLinesProvider(provider, dimOptions.legends, options.scaleOnSelection, this.ornamentMatrix) :
                    new FilterableMatrixProvider_1.FilterableLinesProvider(provider, dimOptions.legends, options.scaleOnSelection, this.ornamentMatrix);
            }
            else {
                this.provider = provider;
            }
            this.intervalsProvider = intervalsProvider;
            this.options = options;
            this.instanceNumber = ++GLines.instancesCount;
        }
        GLines.prototype.getLegendProvider = function (dim) {
            var p = this.provider;
            if (p instanceof FilterableMatrixProvider_1.FilterableLinesProvider)
                return p.legendDimension(dim);
            return null;
        };
        GLines.prototype.renderLegend = function (parentDiv) {
            this.legendDiv = parentDiv;
            this.legend = [];
            var lps = [];
            var lpCount = 0;
            for (var i = 0; i < 2; i++) {
                if (lps[i] = this.getLegendProvider(i))
                    lpCount++;
            }
            for (var i = 0; i < 2; i++) {
                var lp = lps[i];
                if (lp) {
                    this.legend[i] = GLegend_1.GLegend.create(lp, this.ornamentMatrix.ornament(i), new GLegend_1.GLegendOptions({ showTitle: lpCount > 1 }));
                    this.legend[i].renderContents(parentDiv);
                }
            }
        };
        GLines.prototype.setLineSmoothing = function (value) {
            this.options.lineSmoothing = value;
            this.linesContent.setLineSmoothing(value);
        };
        GLines.prototype.isInGraph = function (x, y) {
            if (x < 0 || x > this.graphSize[0])
                return false;
            if (y < (this.intervalsContent ? -20 : 0) || y > this.graphSize[1])
                return false;
            return true;
        };
        GLines.prototype.highlightLegend = function (lines) {
            if (!this.legend)
                return;
            var _loop_1 = function(i) {
                var lp = this_1.getLegendProvider(i);
                if (lp) {
                    var indices = extractDim(lines, i);
                    indices = indices.map(function (index) { return lp.sourceIndex(index); });
                    this_1.legend[i].highlightMultiple(indices);
                }
            };
            var this_1 = this;
            for (var i = 0; i < 2; i++) {
                _loop_1(i);
            }
        };
        GLines.prototype.handleMouseOverGraph = function () {
            var kC = d3.mouse(this.svg.node());
            var mouseX = kC[0] - this.margin.left;
            var mouseY = kC[1] - (this.margin.top + (this.intervalsContent ? 20 : 0));
            if (this.isInGraph(mouseX, mouseY)) {
                var lines = this.linesContent.findCloseLines(mouseX, mouseY);
                this.linesContent.showPoints(lines);
                if (this.projections)
                    this.projections.showProjections(lines, mouseX, mouseY);
                this.highlightLegend(lines);
                if (this.intervalsContent) {
                    var intervalIndex = this.intervalsContent.resolvePosition(mouseX);
                    this.intervalsContent.showIntervalName(intervalIndex);
                }
            }
            else {
                if (this.legend) {
                    for (var i = 0; i < 2; i++) {
                        if (this.legend[i])
                            this.legend[i].clearHighlight();
                    }
                }
            }
        };
        GLines.prototype.handleMouseOutGraph = function () {
            this.linesContent.clearPoints();
            if (this.projections)
                this.projections.clearProjections();
            if (this.legend) {
                for (var i = 0; i < 2; i++) {
                    if (this.legend[i])
                        this.legend[i].clearHighlight();
                }
            }
            if (this.intervalsContent) {
                this.intervalsContent.showIntervalName(-1);
            }
        };
        GLines.prototype.getFilteredOrnamentMatrix = function () {
            if (this.provider instanceof FilterableMatrixProvider_1.FilterableLinesProvider) {
                return this.provider;
            }
            return this.ornamentMatrix;
        };
        GLines.prototype.computeMargin = function () {
            this.margin = new Margin(10, 10, 10, 10)
                .add(this.yAxis.computeMargin())
                .add(this.xAxis.computeMargin());
            if (this.timeLine) {
                this.margin = this.margin.add(this.timeLine.computeMargin());
            }
        };
        GLines.prototype.createProjections = function () {
            var m = this.options.detailMode;
            if (m[0] == "projection" || m[1] == "projection") {
                this.projections = new Projections(this.provider, this.getFilteredOrnamentMatrix(), m[0] == "projection" ? this.xAxis : null, m[1] == "projection" ? this.yAxis : null);
            }
        };
        GLines.prototype.renderContents = function (parentDiv, w, h) {
            var _this = this;
            this.parentDiv = parentDiv;
            var chart = parentDiv.append("div")
                .attr("class", "linechart graph");
            this.svg = chart.append("svg")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("style", "height:" + h + "px");
            this.clipName = "lineclip" + this.instanceNumber;
            var xProvider = new LineToXProvider(this.provider);
            var ticks = this.options.tickStyle;
            this.xAxis = new ValuesAxis_1.HorizontalValuesAxis(xProvider, ValuesAxis_1.tickStyle(ticks[0]), true);
            this.yAxis = new ValuesAxis_1.VerticalValuesAxis(this.provider, ValuesAxis_1.tickStyle(ticks[1]), false);
            this.provider.on("changed", function (event) { return _this.processChange(event); });
            this.linesContent = new LinesContent(this.provider, this.getFilteredOrnamentMatrix(), this.xAxis, this.yAxis, this.clipName + "-in", this.options.lineSmoothing);
            this.createProjections();
            var p = this.provider;
            if (this.options.timeLine && (this.options.timeLine == "full" || this.options.timeLine == "small") && isVariableProvider(p)) {
                this.timeLine = new TimeLine(p, this.getFilteredOrnamentMatrix(), this.options.timeLine == "full");
                this.brush = new Brush(p, this.xAxis);
            }
            if (this.intervalsProvider) {
                this.intervalsContent = new IntervalsContent(this.intervalsProvider, xProvider, 0, this.xAxis, this.clipName + "-out");
            }
            this.computeMargin();
            var width = this.margin.netWidth(w);
            var outHeight = this.margin.netHeight(h);
            var intervalMargin = this.intervalsContent ? 20 : 0;
            var inHeight = outHeight - intervalMargin;
            var outGraph = this.svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
            this.outClipRect = outGraph.append("defs").append("clipPath")
                .attr("id", this.clipName + "-out")
                .append("rect")
                .attr("width", width)
                .attr("height", outHeight);
            this.xAxis.setSize(width, inHeight);
            this.yAxis.setSize(width, inHeight);
            if (this.intervalsContent) {
                this.intervalsContent.renderContents(outGraph, width, outHeight);
            }
            var inGraph = intervalMargin > 0 ?
                outGraph.append("g").attr("transform", "translate(0," + intervalMargin + ")") :
                outGraph;
            this.graphic = inGraph;
            this.graphSize = [width, inHeight];
            this.inClipRect = inGraph.append("defs").append("clipPath")
                .attr("id", this.clipName + "-in")
                .append("rect")
                .attr("y", -intervalMargin)
                .attr("width", width)
                .attr("height", outHeight);
            this.xAxis.renderContents(inGraph);
            this.yAxis.renderContents(inGraph);
            if (this.yAxis.renderSize[1] > inHeight) {
                h += this.yAxis.renderSize[1] - inHeight;
                outHeight += this.yAxis.renderSize[1] - inHeight;
                inHeight = this.yAxis.renderSize[1];
                this.xAxis.setSize(width, inHeight);
                this.inClipRect.attr("height", outHeight);
                this.outClipRect.attr("height", outHeight);
                this.svg.attr("viewBox", "0 0 " + w + " " + h)
                    .attr("style", "height:" + h + "px");
                if (this.intervalsContent) {
                    this.intervalsContent.setSize(width, outHeight);
                }
            }
            this.linesContent.renderContents(inGraph, width, inHeight, false);
            if (this.timeLine) {
                var timeLineHeight = this.timeLine.computeMargin().bottom;
                this.timeLineContainer = this.svg.append("g")
                    .attr("transform", "translate(" + this.margin.left + "," + (h - timeLineHeight - 10) + ")");
                this.timeLine.renderContents(this.timeLineContainer, width, timeLineHeight);
                this.brush.renderContents(outGraph, width, outHeight);
            }
            this.svg.on("mouseleave", function () { return _this.handleMouseOutGraph(); });
            this.svg.on("mousemove", function () { return _this.handleMouseOverGraph(); });
            return this.size = [w, h];
        };
        GLines.prototype.processChange = function (event) {
            var marginImpacted = this.yAxis.processChange(event);
            this.linesContent.processChange(event);
            if (marginImpacted) {
                this.computeMargin();
                this.resize(this.size[0], this.size[1], true);
            }
        };
        GLines.prototype.resize = function (w, h, animate) {
            var width = this.margin.netWidth(w);
            var outHeight = this.margin.netHeight(h);
            var inHeight = this.intervalsContent ? outHeight - 20 : outHeight;
            this.xAxis.setSize(width, inHeight);
            this.yAxis.setSize(width, inHeight);
            if (this.yAxis.renderSize[1] > inHeight) {
                h += this.yAxis.renderSize[1] - inHeight;
                outHeight += this.yAxis.renderSize[1] - inHeight;
                inHeight = this.yAxis.renderSize[1];
                this.xAxis.setSize(width, inHeight);
            }
            this.outClipRect
                .attr("width", width)
                .attr("height", outHeight);
            this.inClipRect
                .attr("width", width)
                .attr("height", outHeight);
            if (this.intervalsContent) {
                this.intervalsContent.setSize(width, outHeight);
            }
            this.linesContent.setSize(width, inHeight, animate);
            if (this.timeLine) {
                var timeLineHeight = this.timeLine.computeMargin().bottom;
                this.timeLineContainer.attr("transform", "translate(" + this.margin.left + "," + (h - timeLineHeight - 10) + ")");
                this.timeLine.setSize(width, timeLineHeight);
                this.brush.setSize(width, outHeight);
            }
            this.svg.attr("viewBox", "0 0 " + w + " " + h)
                .attr("style", "height:" + h + "px");
            return this.size = [w, h];
        };
        GLines.prototype.on = function (type, listener) {
            return { remove: function () { } };
        };
        GLines.instancesCount = 0;
        return GLines;
    }());
    exports.GLines = GLines;
});

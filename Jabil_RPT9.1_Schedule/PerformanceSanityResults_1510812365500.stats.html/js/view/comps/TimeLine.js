define(["require", "exports", "view/comps/VirtualValuesAxis", "view/comps/LinesContent", "view/util/Margin", "view/util/LineToXProvider"], function (require, exports, VirtualValuesAxis, LinesContent, Margin, LineToXProvider) {
    "use strict";
    var TimeLine = (function () {
        function TimeLine(provider, ornamentMatrix, showLines) {
            this.showLines = false;
            this.variable = provider;
            this.ornamentMatrix = ornamentMatrix;
            this.fixed = provider.getFixedProvider();
            this.showLines = showLines;
            this.xAxis = new VirtualValuesAxis(new LineToXProvider(this.fixed), true, true);
        }
        TimeLine.prototype.computeMargin = function () {
            var height = this.showLines ? 60 : 25;
            return new Margin(0, 0, height, 0).add(this.xAxis.computeMargin());
        };
        TimeLine.prototype.renderContents = function (parent, width, height) {
            var _this = this;
            var xaxisMargin = this.xAxis.computeMargin();
            width = xaxisMargin.netWidth(width);
            height = xaxisMargin.netHeight(height);
            this.xAxis.setSize(width, height);
            if (this.showLines) {
                var yAxis = new VirtualValuesAxis(this.fixed, false, true);
                this.lines = new LinesContent(this.fixed, this.ornamentMatrix, this.xAxis, yAxis, "TODO", false);
                yAxis.setSize(width, height - 6);
                var miniGraph = parent.append("g")
                    .attr("class", "minigraph")
                    .attr("transform", "translate(0, 3)");
                this.lines.renderContents(miniGraph, width, height - 6, true);
            }
            this.brush = d3.svg.brush()
                .x(this.xAxis.scales[0])
                .extent(this.variable.xDomain())
                .on("brushend", function () { return _this.brushed(); });
            this.domBrush = parent.append("g")
                .attr("class", "brush")
                .call(this.brush);
            this.domBrush.select(".background")
                .style("visibility", null);
            this.domBrush.selectAll("rect")
                .attr("y", 0)
                .attr("height", height);
            this.domBrush.selectAll(".resize > rect")
                .style("visibility", null);
            this.variable.on("changed", function (event) {
                if (event.xDomainChanged)
                    _this.xDomainChanged();
            });
        };
        TimeLine.prototype.reset = function () {
            this.brush.extent(this.xAxis.scales[0].domain());
            this.domBrush.call(this.brush);
        };
        TimeLine.prototype.brushed = function () {
            var from = Math.floor(this.brush.extent()[0]);
            var to = Math.floor(this.brush.extent()[1]);
            if (from == to) {
                this.reset();
                from = Math.floor(this.brush.extent()[0]);
                to = Math.floor(this.brush.extent()[1]);
            }
            this.variable.setXDomain([from, to]);
        };
        TimeLine.prototype.xDomainChanged = function () {
            var newExtent = this.variable.xDomain();
            this.brush.x(this.xAxis.scales[0]);
            this.brush.extent(newExtent);
            this.domBrush.call(this.brush);
        };
        TimeLine.prototype.setSize = function (width, height) {
            var xaxisMargin = this.xAxis.computeMargin();
            width = xaxisMargin.netWidth(width);
            height = xaxisMargin.netHeight(height);
            this.xAxis.setSize(width, height);
            if (this.lines) {
                this.lines.setSize(width, height);
            }
            this.brush
                .x(this.xAxis.scales[0])
                .extent(this.variable.xDomain());
            this.domBrush.call(this.brush);
        };
        return TimeLine;
    }());
    return TimeLine;
});

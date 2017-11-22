define(["require", "exports"], function (require, exports) {
    "use strict";
    var Brush = (function () {
        function Brush(provider, xAxis) {
            this.provider = provider;
            this.xAxis = xAxis;
        }
        Brush.prototype.renderContents = function (parent, width, height) {
            var _this = this;
            this.brush = d3.svg.brush()
                .x(this.xAxis.scales[0])
                .on("brushend", function () { return _this.brushed(); });
            this.domBrush = parent.append("g")
                .attr("class", "brush")
                .call(this.brush);
            this.domBrush.selectAll("rect")
                .attr("y", 0)
                .attr("height", height);
            this.domBrush.selectAll(".resize > rect")
                .style("visibility", null);
        };
        Brush.prototype.brushed = function () {
            var from = Math.floor(this.brush.extent()[0]);
            var to = Math.floor(this.brush.extent()[1]);
            if (from == to) {
                this.brush.extent(this.provider.getFixedProvider().xDomain());
                from = Math.floor(this.brush.extent()[0]);
                to = Math.floor(this.brush.extent()[1]);
            }
            this.provider.setXDomain([from, to]);
            this.brush.clear();
            this.domBrush.call(this.brush);
        };
        Brush.prototype.setSize = function (width, height) {
            this.domBrush.selectAll("rect")
                .attr("y", 0)
                .attr("height", height);
            this.domBrush.call(this.brush);
        };
        return Brush;
    }());
    return Brush;
});

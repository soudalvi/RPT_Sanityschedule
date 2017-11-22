define(["require", "exports", "view/util/Margin", "view/query/queryUtil"], function (require, exports, Margin, qu) {
    "use strict";
    function invertableOrdinal() {
        var ordinal = d3.scale.ordinal();
        ordinal.invert = function (pos) {
            var width = this.rangeBand();
            for (var idx in this.domain()) {
                var left = this(idx);
                if (pos <= left + width) {
                    if (pos >= left)
                        return +idx;
                    return -1;
                }
            }
            return -1;
        };
        return ordinal;
    }
    function getXMode(items, width) {
        if (items.size() == 0)
            return 0;
        var maxItemWidth = 0;
        items.each(function () {
            var l = qu.textLength(this);
            if (l > maxItemWidth)
                maxItemWidth = l;
        });
        if (maxItemWidth == 0)
            return 0;
        if (maxItemWidth + 10 > (width / items.size()))
            return 2;
        return 1;
    }
    var SeriesAxis = (function () {
        function SeriesAxis(provider) {
            this.provider = provider;
            this.xmode = 0;
        }
        SeriesAxis.prototype.computeMargin = function () {
            var bottom = this.estimateXAxisHeight();
            return new Margin(0, 0, bottom, 0);
        };
        SeriesAxis.prototype.estimateXAxisHeight = function () {
            switch (this.xmode) {
                case 0: return 0;
                case 1: return 20;
                case 2: return 120;
                default: throw "XModeUnhandled";
            }
        };
        SeriesAxis.prototype.position = function (primaryIndex, secondaryIndex) {
            return this.xScale(primaryIndex) + this.innerXScale(secondaryIndex) + this.innerXScale.rangeBand() / 2;
        };
        SeriesAxis.prototype.resolve = function (position) {
            if (position >= 0 && position <= this.xScale.rangeExtent()[1]) {
                var primaryIndex = this.xScale.invert(position);
                if (primaryIndex >= 0 && primaryIndex < this.provider.dimension(0).size()) {
                    position -= this.xScale(primaryIndex);
                    var secondaryIndex = this.innerXScale.invert(position);
                    if (secondaryIndex >= 0 && secondaryIndex < this.provider.dimension(1).size()) {
                        return [primaryIndex, secondaryIndex];
                    }
                }
            }
            return null;
        };
        SeriesAxis.prototype.createXScale = function () {
            return invertableOrdinal();
        };
        SeriesAxis.prototype.updateXScaleRange = function (range) {
            var p0 = this.provider.dimension(0);
            if (p0.size() == 1) {
                this.xScale.rangeRoundBands(range);
            }
            else {
                this.xScale.rangeRoundBands(range, .3);
            }
        };
        SeriesAxis.prototype.updateXScaleDomain = function () {
            var p0 = this.provider.dimension(0);
            this.xScale.domain(d3.range(p0.size()));
        };
        SeriesAxis.prototype.createInnerXScale = function () {
            return invertableOrdinal();
        };
        SeriesAxis.prototype.updateInnerXScaleDomain = function () {
            var p1 = this.provider.dimension(1);
            this.innerXScale.domain(d3.range(p1.size()));
        };
        SeriesAxis.prototype.updateInnerXScaleRange = function () {
            var p0 = this.provider.dimension(0);
            var space = p0.size() == 1 ? 0.3 : 0;
            this.innerXScale.rangeRoundBands([0, this.xScale.rangeBand()], space);
        };
        SeriesAxis.prototype.updateXMode = function (domXAxis, itemsChanged, animate) {
            domXAxis.call(this.xAxis);
            var items = domXAxis.selectAll(".tick text");
            var xmode = getXMode(items, this.width);
            var changed = this.xmode != xmode;
            if (changed)
                this.xmode = xmode;
            if (xmode == 2) {
                items.style("text-anchor", "start");
                if (changed || itemsChanged) {
                    items.attr("transform", "rotate(40)");
                }
            }
            else {
                if (changed || itemsChanged) {
                    items
                        .attr("transform", null)
                        .style("text-anchor", "middle");
                }
            }
            return changed;
        };
        SeriesAxis.prototype.renderContents = function (parent, width, height) {
            this.width = width;
            this.xScale = this.createXScale();
            this.updateXScaleRange([0, width]);
            this.updateXScaleDomain();
            this.innerXScale = this.createInnerXScale();
            this.updateInnerXScaleRange();
            this.updateInnerXScaleDomain();
            this.xAxis = d3.svg.axis()
                .tickSize(0, 0)
                .orient("bottom")
                .scale(this.xScale);
            this.domXAxis = parent.append("g")
                .attr("class", "series axis")
                .attr("transform", "translate(0," + height + ")")
                .call(this.xAxis);
            var marginHasChanged = false;
            var p0 = this.provider.dimension(0);
            this.xAxis.scale(this.xScale);
            var provider = this.provider;
            this.xAxis.tickFormat(function (primaryIndex) { return p0.label(p0.items()[primaryIndex], primaryIndex); });
            marginHasChanged = this.updateXMode(this.domXAxis, true, false);
            return marginHasChanged;
        };
        SeriesAxis.prototype.processChange = function (event) {
            if (event.dimensionsChanged[1]) {
                this.updateInnerXScaleDomain();
            }
            if (event.dimensionsChanged[0]) {
                this.updateXScaleRange([0, this.width]);
                this.updateXScaleDomain();
                this.updateInnerXScaleRange();
                return this.updateXMode(this.domXAxis, true, !event.majorChange);
            }
            return false;
        };
        SeriesAxis.prototype.setWidth = function (width) {
            this.width = width;
            this.updateXScaleRange([0, width]);
            this.updateInnerXScaleRange();
            return this.updateXMode(this.domXAxis, false, false);
        };
        SeriesAxis.prototype.setHeight = function (height) {
            this.domXAxis
                .attr("transform", "translate(0," + height + ")");
        };
        return SeriesAxis;
    }());
    exports.SeriesAxis = SeriesAxis;
});

define(["require", "exports", "view/query/queryUtil"], function (require, exports, qu) {
    "use strict";
    var IntervalsContent = (function () {
        function IntervalsContent(intervalsProvider, unitProvider, intervalsUnitIndex, xAxis, clipName) {
            this.intervalsProvider = intervalsProvider;
            this.unitProvider = unitProvider;
            this.intervalsUnitIndex = intervalsUnitIndex;
            this.xAxis = xAxis;
            this.clipName = clipName;
            this.shownIntervalName = -1;
        }
        IntervalsContent.prototype.renderContents = function (parent, width, height) {
            var _this = this;
            this.container = parent.append("g")
                .classed("interval", true)
                .style("clip-path", this.clipName ? "url(#" + this.clipName + ")" : null);
            this.height = height;
            this.displayData();
            this.intervalsProvider.on("changed", function (event) {
                if (event.intervalsChanged)
                    _this.intervalsChanged();
                else if (event.intervalSelectionChanged)
                    _this.intervalSelectionChanged();
            });
            this.unitProvider.on("changed", function (event) {
                if (event.domainChanged)
                    _this.domainChanged(event.majorChange);
            });
        };
        IntervalsContent.prototype.rectFunctions = function () {
            var intervalsProvider = this.intervalsProvider;
            var scale = this.xAxis.scales[this.intervalsUnitIndex];
            var _height = this.height;
            var shownIntervalName = this.shownIntervalName;
            function _width(interval) {
                var length = intervalsProvider.intervalLength(interval);
                var start = intervalsProvider.intervalStart(interval);
                var end = length == 0 ? scale.range()[1] : scale(start + length);
                return end - scale(start);
            }
            return {
                data: intervalsProvider.intervals(),
                dataKey: intervalsProvider.intervalKey(),
                transform: function (interval) {
                    return "translate(" + scale(intervalsProvider.intervalStart(interval)) + ", 0)";
                },
                width: _width,
                height: _height,
                halfWidth: function (interval) {
                    return _width(interval) / 2;
                },
                selected: function (interval, index) {
                    return intervalsProvider.intervalSelected(interval, index);
                },
                textAttrs: function (interval) {
                    var text = d3.select(this);
                    text.attr("text-anchor", "middle")
                        .attr("dy", "1.4em")
                        .text(intervalsProvider.intervalLabel(interval));
                },
                textVisibleAttrs: function (interval, index) {
                    var text = d3.select(this);
                    var invisible;
                    if (index == shownIntervalName) {
                        invisible = false;
                    }
                    else {
                        var tsize = qu.textLength(this);
                        invisible = tsize > _width(interval);
                    }
                    text.classed("invisible", invisible);
                }
            };
        };
        IntervalsContent.prototype.displayData = function () {
            var functions = this.rectFunctions();
            var sel = this.container.selectAll("rect")
                .data(functions.data, functions.dataKey);
            var newg = sel.enter().append("g")
                .attr("transform", functions.transform);
            newg.append("rect")
                .classed("selected", functions.selected)
                .attr("height", functions.height)
                .attr("width", functions.width);
            newg.append("text")
                .each(functions.textAttrs)
                .attr("x", functions.halfWidth)
                .each(functions.textVisibleAttrs);
            this.currentSelection = sel;
        };
        IntervalsContent.prototype.sizeChanged = function () {
            var functions = this.rectFunctions();
            this.currentSelection
                .attr("transform", functions.transform);
            this.currentSelection.select("rect")
                .attr("height", functions.height)
                .attr("width", functions.width);
            this.currentSelection.select("text")
                .attr("x", functions.halfWidth)
                .each(functions.textVisibleAttrs);
            ;
        };
        IntervalsContent.prototype.domainChanged = function (majorChange) {
            var functions = this.rectFunctions();
            var tr = (majorChange ? this.currentSelection : this.currentSelection.transition())
                .attr("transform", functions.transform);
            tr.select("rect")
                .attr("width", functions.width);
            tr.select("text")
                .attr("x", functions.halfWidth)
                .each(functions.textVisibleAttrs);
            ;
        };
        IntervalsContent.prototype.intervalsChanged = function () {
            var functions = this.rectFunctions();
            var sel = this.container.selectAll("g")
                .data(functions.data, functions.dataKey);
            sel.exit().remove();
            var newg = sel.enter().append("g")
                .attr("transform", functions.transform);
            newg.append("rect")
                .classed("selected", functions.selected)
                .attr("height", functions.height)
                .attr("width", 0);
            newg.append("text")
                .each(functions.textAttrs)
                .attr("x", 0);
            var tr = sel.transition()
                .attr("transform", functions.transform);
            tr.select("rect")
                .attr("width", functions.width);
            tr.select("text")
                .attr("x", functions.halfWidth)
                .each(functions.textVisibleAttrs);
            this.currentSelection = sel;
        };
        IntervalsContent.prototype.intervalSelectionChanged = function () {
            var functions = this.rectFunctions();
            this.currentSelection.select("rect")
                .classed("selected", functions.selected);
        };
        IntervalsContent.prototype.setSize = function (width, height) {
            this.height = height;
            if (this.currentSelection) {
                this.sizeChanged();
            }
        };
        IntervalsContent.prototype.resolvePosition = function (position) {
            var scale = this.xAxis.scales[this.intervalsUnitIndex];
            var intervals = this.intervalsProvider.intervals();
            for (var i = 0; i < intervals.length; i++) {
                var interval = intervals[i];
                var istart = this.intervalsProvider.intervalStart(interval);
                var from = scale(istart);
                var to = scale(istart + this.intervalsProvider.intervalLength(interval));
                if (from <= position && position <= to) {
                    return i;
                }
            }
            return -1;
        };
        IntervalsContent.prototype.showIntervalName = function (index) {
            var functions = this.rectFunctions();
            this.shownIntervalName = index;
            this.currentSelection.select("text")
                .each(functions.textVisibleAttrs);
        };
        return IntervalsContent;
    }());
    return IntervalsContent;
});

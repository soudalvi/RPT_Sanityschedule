var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Margin", "view/comps/VirtualValuesAxis", "view/query/queryUtil"], function (require, exports, Margin, VirtualValuesAxis, qu) {
    "use strict";
    var TICK_SIZE = 3;
    var MARGIN_SIZE = 40;
    function stopTransition(s, name) {
        if (s.node()["__transition_" + name + "__"]) {
            return s.transition("name").duration(0);
        }
        return s;
    }
    function anim(s, animate, name) {
        if (s.empty())
            return s;
        if (animate)
            return s.transition(name);
        return stopTransition(s, name);
    }
    function tickStyle(s) {
        switch (s) {
            case "cue": return 1;
            default: return 0;
        }
    }
    exports.tickStyle = tickStyle;
    var ValuesAxis = (function (_super) {
        __extends(ValuesAxis, _super);
        function ValuesAxis(provider, horizontal, style, tickStyle, monitoring) {
            _super.call(this, provider, horizontal, monitoring);
            this.style = style;
            this.tickStyle = tickStyle;
            var n = this.provider.unitCount();
            this.unitIndices = n > 2 ? [] : d3.range(n);
        }
        ValuesAxis.prototype.createVisualScales = function () {
            var n = this.unitIndices.length;
            var scales = [];
            var range = this.computeRange();
            for (var axisIndex = 0; axisIndex < n; axisIndex++) {
                var unitIndex = this.unitIndices[axisIndex];
                var scale = this.provider.unitScale(unitIndex, this.provider.unitDomain(unitIndex));
                scale.scale.range(range);
                scales[axisIndex] = scale;
            }
            return scales;
        };
        ValuesAxis.prototype.createAxes = function () {
            var n = this.unitIndices.length;
            var axes = [];
            for (var axisIndex = 0; axisIndex < n; axisIndex++) {
                axes[axisIndex] = this.createAxis(axisIndex)
                    .scale(this.visualScales[axisIndex].scale);
                this.formatTicks(axes[axisIndex], axisIndex);
            }
            return axes;
        };
        ValuesAxis.prototype.renderContents = function (parent) {
            if (!this.renderSize)
                throw "Illegal usage: setSize must be called before renderContents";
            this.parent = parent;
            this.renderAxes(this.parent, false);
        };
        ValuesAxis.prototype.renderAxes = function (parent, transition) {
            parent.selectAll(".axis.values." + this.style).remove();
            this.visualScales = this.createVisualScales();
            this.axes = this.createAxes();
            var n = this.unitIndices.length;
            var ret = parent.selectAll(".axis.values." + this.style)
                .data(this.unitIndices);
            var enter = ret.enter().insert("g", ":first-child")
                .attr("class", "values axis " + this.style);
            if (transition)
                enter.attr("opacity", 0);
            this.decorateAxes(enter);
            this.domAxes = ret;
            this.applyAxes(false);
            if (transition)
                enter.transition("fade").duration(100).attr("opacity", 1);
        };
        ValuesAxis.prototype.applyAxes = function (animate) {
            var axes = this.axes;
            var _this = this;
            anim(this.domAxes, animate, "scale").each(function (unitIndex, axisIndex) {
                var domAxis = d3.select(this);
                var a = axes[axisIndex];
                domAxis.call(a).classed("cues", _this.useCues(a));
            });
        };
        ValuesAxis.prototype.decorateAxes = function (axes) {
            var _this = this;
            axes.append("text")
                .attr("class", "axis-label")
                .text(function (unitIndex, axisIndex) { return _this.unitLabel(axisIndex); })
                .call(function (s) { return _this.decorateAxisLabels(s); });
        };
        ValuesAxis.prototype.unitLabel = function (axisIndex) {
            return this.visualScales[axisIndex].unit;
        };
        ValuesAxis.prototype.setSize = function (width, height, animate) {
            var _this = this;
            _super.prototype.setSize.call(this, width, height, animate);
            if (!this.domAxes)
                return;
            var range = this.computeRange();
            this.visualScales.forEach(function (s) { return s.scale.range(range); });
            this.axes.forEach(function (a, i) { return _this.formatTicks(a, i); });
            this.applySize(width, height, animate);
        };
        ValuesAxis.prototype.domainChanged = function (majorChange) {
            var _this = this;
            _super.prototype.domainChanged.call(this, majorChange);
            this.visualScales = this.createVisualScales();
            this.domAxes.select(".axis-label").text(function (d, i) { return _this.visualScales[i].unit; });
            this.axes.forEach(function (a, i) {
                var vs = _this.visualScales[i];
                a.scale(vs.scale);
                a.tickFormat(vs.tickFormat);
            });
            this.applyAxes(!majorChange);
        };
        ValuesAxis.prototype.unitsChanged = function (event) {
            _super.prototype.unitsChanged.call(this, event);
            var n = this.provider.unitCount();
            return this.setDisplayedUnits(n > 2 ? [] : d3.range(n), event);
        };
        ValuesAxis.prototype.highlightableAxesCount = function () {
            var n = this.provider.unitCount();
            return n <= 2 ? n : 1;
        };
        ValuesAxis.prototype.highlightAxes = function (unitIndices) {
            var n = this.provider.unitCount();
            if (n <= 1)
                return;
            if (n == 2) {
                this.parent.selectAll(".axis.values." + this.style)
                    .transition("fade").duration(100)
                    .attr("opacity", unitIndices.length == 0 ? 1 :
                    function (ui, ai) { return unitIndices.indexOf(ui) != -1 ? 1 : 0.18; });
            }
            else {
                this.setDisplayedUnits(unitIndices.slice(0, 1));
            }
        };
        ValuesAxis.prototype.setDisplayedUnits = function (unitIndices, event) {
            if (!event && qu.arrayEquals(unitIndices, this.unitIndices))
                return;
            var wasDouble = this.unitIndices.length > 1;
            var isDouble = unitIndices.length > 1;
            this.unitIndices = unitIndices;
            this.renderAxes(this.parent, true);
            return isDouble != wasDouble;
        };
        ValuesAxis.prototype.getValueText = function (value, unitIndex) {
            var axisIndex = this.unitIndices.indexOf(unitIndex);
            if (axisIndex == -1)
                return "?";
            var vs = this.visualScales[axisIndex].scale;
            return vs.tickFormat(this.axes[axisIndex].ticks())(vs.invert(this.scales[unitIndex](value)));
        };
        ValuesAxis.prototype.formatTicks = function (axis, index) {
            var vs = this.visualScales[index];
            axis.tickFormat(axis.tickValues() !== null ? vs.detailFormat : vs.tickFormat);
        };
        ValuesAxis.prototype.highlightValues = function (unitIndex, values) {
            var _this = this;
            var axisIndex = this.unitIndices.indexOf(unitIndex);
            if (axisIndex == -1)
                return;
            var visual = function (v) { return _this.visualScales[axisIndex].scale.invert(_this.scales[unitIndex](v)); };
            this.formatTicks(this.axes[axisIndex].tickValues(values.map(visual)), axisIndex);
            this.applyAxes(false);
        };
        ValuesAxis.prototype.dishighlightValues = function () {
            var _this = this;
            this.axes.forEach(function (a, i) { return _this.formatTicks(a.tickValues(null), i); });
            this.applyAxes(false);
        };
        ValuesAxis.prototype.useCues = function (axis) {
            return this.tickStyle == 1 || axis.tickValues() !== null;
        };
        return ValuesAxis;
    }(VirtualValuesAxis));
    exports.ValuesAxis = ValuesAxis;
    var HorizontalValuesAxis = (function (_super) {
        __extends(HorizontalValuesAxis, _super);
        function HorizontalValuesAxis(provider, tickStyle, monitoring) {
            _super.call(this, provider, true, "horizontal", tickStyle, monitoring);
        }
        HorizontalValuesAxis.prototype.computeMargin = function () {
            var top = this.unitIndices.length > 1 ? 20 : 0;
            return new Margin(top, 0, 20, 0);
        };
        HorizontalValuesAxis.prototype.formatTicks = function (axis, index) {
            _super.prototype.formatTicks.call(this, axis, index);
            if (axis.tickValues() === null) {
                axis.ticks(this.renderSize[0] / 70);
            }
            axis.tickSize(this.useCues(axis) ? -this.renderSize[1] : TICK_SIZE, 0);
        };
        HorizontalValuesAxis.prototype.createAxis = function (axisIndex) {
            return d3.svg.axis().orient(axisIndex % 2 ? "top" : "bottom");
        };
        HorizontalValuesAxis.prototype.renderAxes = function (parent, transition) {
            _super.prototype.renderAxes.call(this, parent, transition);
            this.domAxes.filter(function (ui, ai) { return ai % 2 == 0; })
                .attr("transform", "translate(0," + this.renderSize[1] + ")");
        };
        HorizontalValuesAxis.prototype.decorateAxisLabels = function (labels) {
            labels
                .attr("transform", "translate(" + this.renderSize[0] + ",0)")
                .attr("y", 0)
                .attr("dy", "-.5em")
                .style("text-anchor", "end");
        };
        HorizontalValuesAxis.prototype.applySize = function (width, height, animate) {
            this.applyAxes(animate);
            this.domAxes
                .filter(function (ui, ai) { return ai % 2 == 0; })
                .attr("transform", "translate(0," + height + ")");
            this.domAxes.select(".axis-label")
                .attr("transform", "translate(" + width + ",0)");
        };
        return HorizontalValuesAxis;
    }(ValuesAxis));
    exports.HorizontalValuesAxis = HorizontalValuesAxis;
    var VerticalValuesAxis = (function (_super) {
        __extends(VerticalValuesAxis, _super);
        function VerticalValuesAxis(provider, tickStyle, monitoring) {
            _super.call(this, provider, false, "vertical", tickStyle, monitoring);
        }
        VerticalValuesAxis.prototype.computeMargin = function () {
            var right = this.unitIndices.length > 1 ? MARGIN_SIZE : 0;
            return new Margin(0, right, 0, MARGIN_SIZE);
        };
        VerticalValuesAxis.prototype.formatTicks = function (axis, index) {
            _super.prototype.formatTicks.call(this, axis, index);
            if (axis.tickValues() === null) {
                axis.ticks(this.renderSize[1] / 36);
            }
            axis.tickSize(this.useCues(axis) ? -this.renderSize[0] : TICK_SIZE, 0);
        };
        VerticalValuesAxis.prototype.createAxis = function (axisIndex) {
            return d3.svg.axis()
                .orient(axisIndex % 2 ? "right" : "left");
        };
        VerticalValuesAxis.prototype.renderAxes = function (parent, transition) {
            _super.prototype.renderAxes.call(this, parent, transition);
            this.domAxes.filter(function (ui, ai) { return ai % 2 != 0; })
                .attr("transform", "translate(" + this.renderSize[0] + ",0)");
            this.checkSize();
        };
        VerticalValuesAxis.prototype.checkSize = function () {
            var textLength = 0;
            this.domAxes.select("text").each(function (d, i) {
                textLength = Math.max(textLength, qu.textLength(this));
            });
            if (textLength + 8 > this.renderSize[1]) {
                this.setSize(this.renderSize[0], textLength + 8, false);
                return false;
            }
            return true;
        };
        VerticalValuesAxis.prototype.decorateAxes = function (axes) {
            _super.prototype.decorateAxes.call(this, axes);
            this.applyZeroLines(axes.append("line"));
        };
        VerticalValuesAxis.prototype.applyZeroLines = function (lines) {
            var _this = this;
            var y = function (d, i) { return _this.scales[i](0); };
            lines.attr("y1", y)
                .attr("x1", function (ui, ai) { return ai % 2 ? -_this.renderSize[0] : null; })
                .attr("x2", function (ui, ai) { return ai % 2 ? null : _this.renderSize[0]; })
                .attr("y2", y);
        };
        VerticalValuesAxis.prototype.decorateAxisLabels = function (labels) {
            labels
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("dy", function (ui, ai) { return (ai % 2) ? "-.35em" : "1em"; })
                .style("text-anchor", "end");
        };
        VerticalValuesAxis.prototype.applySize = function (width, height, animate) {
            if (!this.checkSize())
                return;
            this.applyAxes(animate);
            this.applyZeroLines(anim(this.domAxes.select("line"), false, "scale"));
            this.domAxes
                .filter(function (ui, ai) { return ai % 2 != 0; })
                .attr("transform", "translate(" + width + ",0)");
        };
        VerticalValuesAxis.prototype.domainChanged = function (majorChange) {
            _super.prototype.domainChanged.call(this, majorChange);
            this.applyZeroLines(anim(this.domAxes.select("line"), !majorChange, "scale"));
        };
        return VerticalValuesAxis;
    }(ValuesAxis));
    exports.VerticalValuesAxis = VerticalValuesAxis;
});

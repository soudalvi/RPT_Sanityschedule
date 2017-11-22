var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/OrnamentProviders", "jrptlib/Properties!APPMSG"], function (require, exports, OrnamentProviders_1, APPMSG) {
    "use strict";
    var GLegendOptions = (function () {
        function GLegendOptions(_a) {
            var _b = _a.showTitle, showTitle = _b === void 0 ? false : _b, _c = _a.allowDoubleClick, allowDoubleClick = _c === void 0 ? true : _c;
            this.showTitle = showTitle;
            this.allowDoubleClick = allowDoubleClick;
        }
        return GLegendOptions;
    }());
    exports.GLegendOptions = GLegendOptions;
    var GLegend = (function () {
        function GLegend(provider, options) {
            this.provider = provider;
            this.options = options;
        }
        GLegend.create = function (provider, ornamentProvider, options) {
            if (OrnamentProviders_1.isColorProvider(ornamentProvider))
                return new GColorLegend(provider, ornamentProvider, options);
            if (OrnamentProviders_1.isStrokeProvider(ornamentProvider))
                return new GStrokeLegend(provider, ornamentProvider, options);
            if (OrnamentProviders_1.isShadeProvider(ornamentProvider))
                return new GShadeLegend(provider, ornamentProvider, options);
            return new GRegularLegend(provider, options);
        };
        GLegend.prototype.renderContents = function (parent) {
            var _this = this;
            this.legend = parent.append("div")
                .classed("legend", true);
            if (this.options.showTitle) {
                this.legend.append("header").text(this.provider.name());
            }
            this.legend.append("ul");
            this.legend.append("footer")
                .append("a").text(APPMSG.SelectAllButton_label)
                .style("visibility", "hidden")
                .attr("href", "#")
                .on("click", function () { return _this.selectAll(); });
            this.renderItems();
            this.provider.on("changed", function (event) { return _this.processChange(event); });
        };
        GLegend.prototype.processChange = function (event) {
            if (event.sourceItemsChanged) {
                this.legend.select("ul").selectAll("li").remove();
                this.renderItems();
            }
            else if (event.selectionChanged) {
                this.selectionChanged();
            }
        };
        GLegend.prototype.renderItems = function () {
            var _this = this;
            var source = this.provider.source();
            this.items = this.legend.select("ul").selectAll("li")
                .data(source.items(), source.key());
            var a = this.items.enter()
                .append("li")
                .append("a")
                .attr("href", "#")
                .on("click", function (item, index) { _this.switchSelection(index); d3.event.preventDefault(); });
            if (this.options.allowDoubleClick) {
                a.on("dblclick", function (item, index) { _this.selectOnly(index); d3.event.preventDefault(); });
            }
            this.renderItemVisual(a);
            a.append("span").text(function (item, index) { return source.label(item, index); });
        };
        GLegend.prototype.switchSelection = function (index) {
            var selected = this.provider.isItemSelected(index);
            this.provider.selectItem(index, !selected);
        };
        GLegend.prototype.selectOnly = function (index) {
            this.provider.selectItems([index]);
        };
        GLegend.prototype.selectAll = function () {
            this.provider.selectItems(undefined);
        };
        GLegend.prototype.selectionChanged = function () {
            this.updateItemVisual(this.items);
            this.legend.select("footer").select("a")
                .style("visibility", this.provider.isAllItemsSelected() ? "hidden" : "visible");
        };
        GLegend.prototype.highlight = function (index) {
            this.items.transition().duration(100).style("opacity", function (item, idx) { return idx != index ? .18 : 1; });
        };
        GLegend.prototype.highlightMultiple = function (indices) {
            this.items.transition().duration(100).style("opacity", function (item, index) { return indices.indexOf(index) == -1 ? .18 : 1; });
        };
        GLegend.prototype.clearHighlight = function () {
            this.items.transition().style("opacity", 1);
        };
        return GLegend;
    }());
    exports.GLegend = GLegend;
    var GOrnamentedLegend = (function (_super) {
        __extends(GOrnamentedLegend, _super);
        function GOrnamentedLegend(provider, ornamentProvider, options) {
            _super.call(this, provider, options);
            this.ornamentProvider = ornamentProvider;
        }
        return GOrnamentedLegend;
    }(GLegend));
    function colorFill(legendProvider, colorProvider) {
        return function (item, index) {
            return legendProvider.isItemSelected(index) ? colorProvider.color(index) : "none";
        };
    }
    function colorStroke(colorProvider) {
        return function (item, index) {
            return colorProvider.color(index);
        };
    }
    var GColorLegend = (function (_super) {
        __extends(GColorLegend, _super);
        function GColorLegend() {
            _super.apply(this, arguments);
        }
        GColorLegend.prototype.renderItemVisual = function (a) {
            a.append("svg")
                .attr("height", 15)
                .attr("width", 25)
                .append("rect")
                .attr("height", 15)
                .attr("width", 25)
                .attr("fill", colorFill(this.provider, this.ornamentProvider))
                .attr("stroke", colorStroke(this.ornamentProvider));
        };
        GColorLegend.prototype.updateItemVisual = function (a) {
            a.select("svg").select("rect").transition().attr("fill", colorFill(this.provider, this.ornamentProvider));
        };
        GColorLegend.prototype.getHighlightColor = function (item) {
            var rect = item.select("svg").select("rect");
            return rect.attr("fill");
        };
        return GColorLegend;
    }(GOrnamentedLegend));
    function rectStroke(provider) {
        return function (item, index) {
            return provider.isItemSelected(index) ? "#444444" : "#bbbbbb";
        };
    }
    var GStrokeLegend = (function (_super) {
        __extends(GStrokeLegend, _super);
        function GStrokeLegend(provider, strokeProvider, options) {
            _super.call(this, provider, strokeProvider, options);
        }
        GStrokeLegend.prototype.renderItemVisual = function (a) {
            var _this = this;
            var svg = a.append("svg")
                .attr("height", 15)
                .attr("width", 35);
            svg.append("rect")
                .attr("height", 15)
                .attr("width", 35)
                .attr("fill", "none")
                .attr("stroke", rectStroke(this.provider));
            svg.append("path")
                .attr("d", "M 0 7.5 H 35")
                .attr("stroke", "black")
                .attr("stroke-dasharray", function (item, index) { return _this.ornamentProvider.stroke(index); });
        };
        GStrokeLegend.prototype.updateItemVisual = function (a) {
            a.select("svg").select("rect").transition().attr("stroke", rectStroke(this.provider));
        };
        return GStrokeLegend;
    }(GOrnamentedLegend));
    function shadeFill(legendProvider, shadeProvider) {
        return function (item, index) {
            return legendProvider.isItemSelected(index) ? shadeProvider.shade("#333333", index) : "none";
        };
    }
    var GShadeLegend = (function (_super) {
        __extends(GShadeLegend, _super);
        function GShadeLegend(provider, shadeProvider, options) {
            _super.call(this, provider, shadeProvider, options);
        }
        GShadeLegend.prototype.renderItemVisual = function (a) {
            a.append("svg")
                .attr("height", 15)
                .attr("width", 25)
                .append("rect")
                .attr("height", 15)
                .attr("width", 25)
                .attr("fill", shadeFill(this.provider, this.ornamentProvider))
                .attr("stroke", "black");
        };
        GShadeLegend.prototype.updateItemVisual = function (a) {
            a.select("svg").select("rect").transition().attr("fill", shadeFill(this.provider, this.ornamentProvider));
        };
        return GShadeLegend;
    }(GOrnamentedLegend));
    function regularFill(provider) {
        return function (item, index) {
            return provider.isItemSelected(index) ? "gray" : "none";
        };
    }
    var GRegularLegend = (function (_super) {
        __extends(GRegularLegend, _super);
        function GRegularLegend(provider, options) {
            _super.call(this, provider, options);
        }
        GRegularLegend.prototype.renderItemVisual = function (a) {
            a.append("svg")
                .attr("height", 15)
                .attr("width", 25)
                .append("rect")
                .attr("height", 15)
                .attr("width", 25)
                .attr("fill", regularFill(this.provider))
                .attr("stroke", "black");
        };
        GRegularLegend.prototype.updateItemVisual = function (a) {
            a.select("svg").select("rect").transition().attr("fill", regularFill(this.provider));
        };
        return GRegularLegend;
    }(GLegend));
});

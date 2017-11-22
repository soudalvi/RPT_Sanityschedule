var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/queryUtil", "view/util/DimensionUtil", "view/util/OrnamentProviders", "jrptlib/Properties!APPMSG", "jrptlib/TableWrapper", "ui/Prefs!"], function (require, exports, qu, du, OrnamentProviders_1, APPMSG, TableWrapper, Prefs) {
    "use strict";
    exports.TableSeries = {
        ids: ["row", "column", "rowGroup"],
        labels: [APPMSG.Row, APPMSG.Column, APPMSG.RowGroup]
    };
    var GTableOptions = (function () {
        function GTableOptions() {
            this.minibars = true;
        }
        return GTableOptions;
    }());
    exports.GTableOptions = GTableOptions;
    var GTable = (function () {
        function GTable(provider, options) {
            this.provider = provider;
            this.options = options;
            if (options.minibars === undefined)
                options.minibars = true;
            this.colorProvider = OrnamentProviders_1.toColorProvider(provider, 1);
        }
        GTable.create = function (provider, options) {
            var dim = provider.dimensionsCount();
            var dimOptions = options.dimensions;
            dimOptions.validate(dim);
            if (dimOptions.series[1] == null)
                dimOptions.move(2, 1);
            if (dimOptions.series[2] == null)
                dimOptions.cut(2);
            provider = du.swap(provider, dimOptions.series);
            if (dimOptions.size() == 2)
                return new G2DTable(provider, options);
            return new G3DTable(provider, options);
        };
        GTable.prototype.rowProvider = function () {
            return this.provider.dimension(0);
        };
        GTable.prototype.columnProvider = function () {
            return this.provider.dimension(1);
        };
        GTable.prototype.computeScales = function (width) {
            var provider = this.provider;
            var size = provider.unitCount();
            var scales = new Array(size);
            for (var i = 0; i < size; i++) {
                if (provider.unitLabel(i) != null) {
                    scales[i] = d3.scale.linear()
                        .range([0, width])
                        .domain(provider.unitDomain(i));
                }
            }
            return scales;
        };
        GTable.prototype.barFunctions = function (width) {
            var scales = this.computeScales(width);
            var provider = this.provider;
            var colorProvider = this.colorProvider;
            function _barWidth(index) {
                var data = provider.data(index);
                var val = provider.dataValue(data);
                if (val == null)
                    return 0;
                var unit = provider.dataUnit(index);
                var ret = scales[unit](val);
                if (ret == 0)
                    ret = 1;
                return ret;
            }
            return {
                barWidth: _barWidth,
                barFill: function (index) {
                    return colorProvider.color(index[1]).toString();
                },
                textAttrs: function (sel, index) {
                    var x = 3;
                    var outside;
                    var data = provider.data(index);
                    var val = provider.dataValue(data);
                    var tw = qu.textLength(sel.node());
                    var bw;
                    if (val != null) {
                        bw = _barWidth(index);
                        if ((tw > bw - 3)) {
                            x += bw;
                            outside = true;
                        }
                        else {
                            outside = false;
                        }
                    }
                    else {
                        bw = 0;
                        outside = true;
                    }
                    sel.attr("x", x);
                    sel.classed("outside", outside);
                    if (!outside) {
                        var bkc = colorProvider.color(index[1]);
                        sel.style("fill", qu.textColor(bkc));
                    }
                    else {
                        sel.style("fill", null);
                    }
                    if (outside == false)
                        return true;
                    return (tw <= width - bw);
                },
                valueDisplay: function (index) {
                    var data = provider.data(index);
                    return provider.dataText(data, index);
                },
                numeric: function (index) {
                    var unitIndex = provider.dataUnit(index);
                    return provider.unitLabel(unitIndex) != null;
                }
            };
        };
        GTable.prototype.updateValueBar = function (td, i1, i3, width, minibars) {
            var functions = this.barFunctions(width);
            var barHeight = 18;
            td.each(function (secondaryItem, i2) {
                var td = d3.select(this);
                var index = [i1, i2, i3];
                var numeric = functions.numeric(index);
                var svg = td.select("svg");
                if (numeric && minibars) {
                    if (svg.empty()) {
                        td.text("");
                        var bar = td.append("svg")
                            .classed("mini-bar", true)
                            .attr("width", width)
                            .attr("height", barHeight);
                        bar.append("rect")
                            .classed("background", true)
                            .attr("width", width)
                            .attr("height", barHeight);
                        bar.append("rect")
                            .classed("bar", true)
                            .attr("y", 1)
                            .attr("height", barHeight - 2);
                        bar.append("text")
                            .attr("y", barHeight / 2)
                            .attr("dy", ".35em");
                    }
                    td.select("svg .bar")
                        .attr("width", functions.barWidth(index))
                        .style("fill", functions.barFill(index));
                    var svgText = td.select("svg text");
                    svgText.text(functions.valueDisplay(index));
                    var fit = functions.textAttrs(svgText, index);
                    if (fit == false) {
                        svg.remove();
                        td.text(functions.valueDisplay(index));
                    }
                }
                else {
                    if (!svg.empty()) {
                        svg.remove();
                    }
                    td.text(functions.valueDisplay(index));
                }
            });
        };
        GTable.prototype.renderContents = function (parent, w, h) {
            var _this = this;
            this.table = parent.append("table")
                .attr("class", "data-table");
            var colgroup = this.table.append("colgroup");
            colgroup.append("col").classed("first-col", true);
            var titleRow = this.table.append("thead")
                .append("tr");
            titleRow.append("td").html("&nbsp");
            if (Prefs.fixedColumn) {
                this.tableviewer = new TableWrapper(parent.node());
                this.tableviewer.setFixedNFirstColumns(1);
            }
            this.processColumns(colgroup, titleRow, false);
            this.processRows(false, false);
            this.processData(false);
            this.provider.on("changed", function (event) { return _this.processChange(event, colgroup, titleRow); });
        };
        GTable.prototype.processChange = function (event, colgroup, titleRow) {
            var processColumns = event.dimensionsChanged[1];
            var processGroups = event.dimensionsChanged[2];
            var processRows = event.dimensionsChanged[0];
            var processData = event.dataChanged || (event.domainChanged && this.options.minibars) || processColumns;
            if (processColumns) {
                this.processColumns(this.table.select("colgroup"), titleRow, true);
            }
            if (processGroups || processRows) {
                this.processRows(processGroups, processRows);
            }
            if (processData) {
                this.processData(true);
            }
        };
        GTable.prototype.processColumns = function (colgroup, titleRow, update) {
            var provider = this.columnProvider();
            var cols = colgroup.selectAll(".counter")
                .data(provider.items(), provider.key());
            if (update)
                cols.exit().remove();
            cols.enter().append("col")
                .classed("counter", true);
            if (update)
                cols.order();
            cols.classed("odd", function (item, index) { return index % 2 != 0; })
                .classed("even", function (item, index) { return index % 2 == 0; });
            var ths = titleRow.selectAll("th")
                .data(provider.items(), provider.key());
            if (update)
                ths.exit().remove();
            ths.enter().append("th");
            if (update)
                ths.order();
            ths.text(function (item, index) {
                return provider.label(item, index);
            }).attr("scope", "col");
        };
        GTable.prototype.processRows = function (updateGroups, updateRows) {
            var bodies = this.processGroups(updateGroups);
            var provider = this.rowProvider();
            this.rows = bodies.selectAll("tr:not(.group-title)")
                .data(provider.items(), provider.key());
            if (updateGroups || updateRows)
                this.rows.exit().remove();
            this.rows.enter().append("tr")
                .append("th")
                .classed("instance-name", true);
            if (updateRows)
                this.rows.order();
            this.rows.select("th")
                .text(function (item, index) { return provider.label(item, index); });
            this.rows.classed("odd", function (item, index) { return index % 2 != 0; })
                .classed("even", function (item, index) { return index % 2 == 0; });
        };
        GTable.prototype.getDataColumnWidth = function () {
            var col = this.table.select("thead tr th");
            return $(col.node()).width();
        };
        GTable.prototype.processData = function (update) {
            var columnWidth = this.getDataColumnWidth();
            var provider = this.columnProvider();
            var _this = this;
            this.rows.each(function (primaryItem, primaryIndex, tertiaryIndex) {
                var tr = d3.select(this);
                var td = tr.selectAll("td")
                    .data(provider.items());
                if (update)
                    td.exit().remove();
                td.enter().append("td");
                td.call(function (item) { return _this.updateValueBar(item, primaryIndex, tertiaryIndex, columnWidth, _this.options.minibars); });
            });
            if (this.tableviewer)
                this.tableviewer.setTable(this.table.node());
        };
        GTable.prototype.on = function (type, listener) {
            return { remove: function () { } };
        };
        GTable.prototype.resizeTable = function (parent) {
            if (this.tableviewer)
                this.tableviewer.setTable(this.table.node());
        };
        return GTable;
    }());
    exports.GTable = GTable;
    var G3DTable = (function (_super) {
        __extends(G3DTable, _super);
        function G3DTable() {
            _super.apply(this, arguments);
        }
        G3DTable.prototype.groupDimension = function () {
            return this.provider.dimension(2);
        };
        G3DTable.prototype.processGroups = function (update) {
            var provider = this.groupDimension();
            var bodies = this.table.selectAll("tbody")
                .data(provider.items(), provider.key());
            if (update)
                bodies.exit().remove();
            bodies.enter().append("tbody")
                .append("tr")
                .classed("group-title", true)
                .append("th");
            if (update)
                bodies.order();
            bodies.select("tr.group-title > th")
                .text(function (item, index) { return provider.label(item, index); });
            var p2 = this.columnProvider();
            bodies.select("tr.group-title > th")
                .attr("colspan", p2.size() + 1);
            return bodies;
        };
        G3DTable.prototype.processColumns = function (colgroup, titleRow, update) {
            _super.prototype.processColumns.call(this, colgroup, titleRow, update);
            var p2 = this.columnProvider();
            this.table.selectAll("tbody")
                .select("tr.group-title > th")
                .attr("colspan", p2.size() + 1);
        };
        return G3DTable;
    }(GTable));
    var G2DTable = (function (_super) {
        __extends(G2DTable, _super);
        function G2DTable() {
            _super.apply(this, arguments);
        }
        G2DTable.prototype.processGroups = function (update) {
            var bodies = this.table.selectAll("tbody").data([0]);
            if (!update) {
                bodies.enter().append("tbody");
            }
            return bodies;
        };
        return G2DTable;
    }(GTable));
});

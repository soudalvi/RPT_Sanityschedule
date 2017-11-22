define(["require", "exports", "view/util/DimensionUtil", "view/GLegend", "view/prov/GOrnamentProviders", "view/util/FilterableMatrixProvider", "view/util/OrnamentProviders", "jrptlib/Properties!APPMSG"], function (require, exports, du, GLegend_1, GOrnamentProviders_1, FilterableMatrixProvider_1, OrnamentProviders_1, APPMSG) {
    "use strict";
    exports.PieSeries = {
        ids: ["donut", "arc"],
        labels: [APPMSG.Donut, APPMSG.Arc]
    };
    var GPieOptions = (function () {
        function GPieOptions() {
            this.donut = false;
        }
        return GPieOptions;
    }());
    exports.GPieOptions = GPieOptions;
    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    var GPie = (function () {
        function GPie(provider, options) {
            this.options = options;
            var dimOptions = options.dimensions;
            dimOptions.validate(provider.dimensionsCount());
            provider = du.swap(provider, dimOptions.series);
            this.ornamentMatrix = new OrnamentProviders_1.OrnamentMatrix(provider, [null, GOrnamentProviders_1.GOrnamentKind.COLOR]);
            if (dimOptions.useLegend()) {
                var filterable = new FilterableMatrixProvider_1.FilterableTabularProvider(provider, dimOptions.legends, false, this.ornamentMatrix);
                this.colorProvider = filterable.ornament(1);
                this.provider = filterable;
            }
            else {
                this.provider = provider;
                this.colorProvider = this.ornamentMatrix.ornament(1);
            }
        }
        GPie.prototype.getSecondaryLegendProvider = function () {
            var p = this.provider;
            if (p instanceof FilterableMatrixProvider_1.FilterableTabularProvider)
                return p.legendDimension(1);
            return null;
        };
        GPie.prototype.renderLegend = function (parentDiv) {
            this.legendDiv = parentDiv;
            var lp = this.getSecondaryLegendProvider();
            if (lp) {
                this.legend = GLegend_1.GLegend.create(lp, this.ornamentMatrix.ornament(1), new GLegend_1.GLegendOptions({}));
                this.legend.renderContents(parentDiv);
            }
        };
        GPie.prototype.renderContents = function (parent, w, h) {
            var _this = this;
            this.parent = parent;
            this.size = [w, h];
            this.radius = (Math.min(w, h) / 2) - 30;
            var chart = parent.append("div")
                .classed("piechart", true);
            this.svg = chart.append("svg")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("style", "height:" + h + "px");
            this.group = this.svg.append("g")
                .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
            this.slices_group = this.group.append("g").classed("slices", true);
            this.labels_group = this.group.append("g").classed("labels", true);
            this.lines_group = this.group.append("g").classed("lines", true);
            this.secondLabel = this.svg.append("text")
                .attr("transform", "translate(" + w / 2 + "," + 0 + ")")
                .attr("dy", "+1em")
                .attr("text-anchor", "middle");
            this.processRings(this.slices_group);
            this.displayData();
            this.provider.on("changed", function (event) { return _this.processChange(event); });
            return this.size;
        };
        GPie.prototype.processChange = function (event) {
            var processRings = event.dimensionsChanged[0];
            var processSlices = event.dimensionsChanged[1];
            var processData = event.dataChanged;
            if (processRings) {
                this.processRings(this.slices_group);
            }
            if (processSlices) {
                this.displayData();
            }
            else if (processData) {
                this.dataChanged();
            }
        };
        GPie.prototype.processRings = function (parent_group) {
            var size = this.provider.dimension(0).size();
            this.pies = new Array(size);
            for (var i = 0; i < size; i++) {
                this.pies[i] = d3.layout.pie()
                    .sort(null);
            }
            var margin = 4;
            var innerRadius = this.radius / (size * 2);
            var radiusOffset = Math.floor((this.radius - innerRadius) / size);
            radiusOffset -= margin;
            this.arcs = new Array(size);
            this.outerArcs = new Array(size);
            var labelMargin = radiusOffset / 10;
            for (var i = 0; i < size; i++) {
                if (size > 1) {
                    var r = this.radius - i * radiusOffset;
                    this.arcs[i] = d3.svg.arc()
                        .innerRadius(r - radiusOffset + margin)
                        .outerRadius(r);
                    this.outerArcs[i] = d3.svg.arc()
                        .innerRadius(r - radiusOffset + margin)
                        .outerRadius(r);
                }
                else {
                    this.arcs[i] = d3.svg.arc()
                        .outerRadius(this.radius * 0.8)
                        .innerRadius(this.options.donut == false ? 0 : this.radius * 0.4);
                    this.outerArcs[i] = d3.svg.arc()
                        .outerRadius(this.radius * 0.9)
                        .innerRadius(this.radius * 0.9);
                }
            }
        };
        GPie.prototype.resize = function (w, h) {
            this.size = [w, h];
            this.radius = (Math.min(w, h) / 2) - 30;
            var size = this.provider.dimension(0).size();
            var margin = 4;
            var innerRadius = this.radius / (size * 2);
            var radiusOffset = Math.floor((this.radius - innerRadius) / size);
            radiusOffset -= margin;
            for (var i = 0; i < size; i++) {
                if (size > 1) {
                    var r = this.radius - i * radiusOffset;
                    this.arcs[i].innerRadius(r - radiusOffset + margin);
                    this.arcs[i].outerRadius(r);
                    this.outerArcs[i].innerRadius(r - radiusOffset + margin);
                    this.outerArcs[i].outerRadius(r);
                }
                else {
                    this.arcs[i].outerRadius(this.radius * 0.8);
                    this.arcs[i].innerRadius(this.options.donut == false ? 0 : this.radius * 0.4);
                    this.outerArcs[i].outerRadius(this.radius * 0.9);
                    this.outerArcs[i].innerRadius(this.radius * 0.9);
                }
                this.svg.attr("viewBox", "0 0 " + w + " " + h)
                    .attr("style", "height:" + h + "px");
                this.group.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
                this.secondLabel.attr("transform", "translate(" + w / 2 + "," + 0 + ")");
            }
            this.displayData();
            return this.size;
        };
        GPie.prototype.dataChanged = function () {
            this.displayData();
        };
        GPie.prototype.displayData = function () {
            var provider = this.provider;
            var p2 = this.provider.dimension(1);
            var secondaryItems = p2.items();
            var arcs = this.arcs;
            var outerArcs = this.outerArcs;
            var sliceData = function (primaryIndex) {
                var sum = 0;
                var datas = new Array(p2.size());
                for (var i = 0; i < p2.size(); i++) {
                    datas[i] = { index: [primaryIndex, i],
                        item: secondaryItems[i],
                        value: provider.data([primaryIndex, i]),
                        arc: arcs[primaryIndex],
                        labelArc: outerArcs[primaryIndex] };
                    sum += datas[i].value === undefined ? 0 : datas[i].value;
                }
                if (sum == 0) {
                    for (var i = 0; i < p2.size(); i++) {
                        datas[i].value = 0.001;
                    }
                }
                return datas;
            };
            var keyFunc = p2.key();
            var key = undefined;
            if (keyFunc && keyFunc != null) {
                key = function (pie) {
                    return keyFunc(pie.data.item);
                };
            }
            var primaryItems = this.provider.dimension(0).items();
            var rings = this.group.select(".slices").selectAll(".slices g").data(primaryItems);
            rings.enter()
                .append("g")
                .attr("class", "ring");
            rings.exit().remove();
            var labels = this.group.select(".labels").selectAll(".labels g").data(primaryItems);
            labels.enter()
                .append("g")
                .attr("class", "label");
            labels.exit().remove();
            var gpie = this;
            rings.each(function (d, ringIndex) {
                var ring = d3.select(this);
                var arc = gpie.arcs[ringIndex];
                gpie.pies[ringIndex].sort(null)
                    .value(function (d, j) {
                    return gpie.provider.dataValue(d.value);
                });
                var pies = gpie.pies[ringIndex](sliceData(ringIndex));
                var slice = ring.selectAll("path.slice")
                    .data(pies, key);
                slice.enter()
                    .insert("path")
                    .style("fill", function (d, second_idx) {
                    return gpie.colorProvider.color(second_idx).toString();
                })
                    .attr("class", "slice");
                slice
                    .transition().duration(500)
                    .attrTween("d", function (d) {
                    this._current = this._current || d;
                    var d1 = this._current.data;
                    var d2 = d.data;
                    this._current.data = "";
                    d.data = "";
                    var interpolate = d3.interpolateObject(this._current, d);
                    this._current.data = d1;
                    d.data = d2;
                    this._current = interpolate(0);
                    return function (t) {
                        return d.data.arc(interpolate(t));
                    };
                });
                slice.exit().remove();
                slice.on("mouseover", function (d, i) {
                    var lp = gpie.getSecondaryLegendProvider();
                    if (lp) {
                        var legendIndex = lp.sourceIndex(i);
                        gpie.legend.highlight(legendIndex);
                    }
                    gpie.refreshDetailedLabel(d);
                });
                slice.on("mouseout", function (d, i) {
                    if (gpie.legend) {
                        gpie.legend.clearHighlight();
                    }
                    gpie.clearDetailedLabel(d);
                });
                var lp = gpie.getSecondaryLegendProvider();
                if (lp) {
                    slice.on("click", function (d, i) {
                        lp.selectItem(lp.sourceIndex(i), false);
                    });
                }
            });
            labels.each(function (d, ringIndex) {
                var label = d3.select(this);
                var pies = gpie.pies[ringIndex](sliceData(ringIndex));
                var text = label.selectAll("text.text-value")
                    .data(pies, key);
                text.enter()
                    .insert("text")
                    .attr("dy", ".35em")
                    .attr("class", "text-value");
                text.text(function (d) {
                    return gpie.provider.dataText(d.data.value, d.data.index);
                });
                if (gpie.provider.dimension(0).size() == 1) {
                    var rradius = gpie.radius;
                    text.transition().duration(500)
                        .attrTween("transform", function (d) {
                        this._current = this._current || d;
                        var d1 = this._current.data;
                        var d2 = d.data;
                        this._current.data = "";
                        d.data = "";
                        var interpolate = d3.interpolateObject(this._current, d);
                        this._current.data = d1;
                        d.data = d2;
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            var pos = d.data.labelArc.centroid(d2);
                            pos[0] = rradius * (midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate(" + pos + ")";
                        };
                    })
                        .styleTween("text-anchor", function (d) {
                        this._current = this._current || d;
                        var d1 = this._current.data;
                        var d2 = d.data;
                        this._current.data = "";
                        d.data = null;
                        var interpolate = d3.interpolateObject(this._current, d);
                        this._current.data = d1;
                        d.data = d2;
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            return midAngle(d2) < Math.PI ? "start" : "end";
                        };
                    });
                }
                else {
                    text.attr("transform", function (d) {
                        return "translate(" + d.data.labelArc.centroid(d) + ")";
                    })
                        .attr("dy", ".35em");
                }
                text.exit().remove();
                if (gpie.provider.dimension(0).size() == 1) {
                    var polyline = gpie.group.select(".lines").selectAll("polyline")
                        .data(pies, key);
                    polyline.enter()
                        .append("polyline");
                    polyline.transition().duration(500)
                        .attrTween("points", function (d) {
                        this._current = this._current || d;
                        var d1 = this._current.data;
                        var d2 = d.data;
                        this._current.data = "";
                        d.data = "";
                        var interpolate = d3.interpolateObject(this._current, d);
                        this._current.data = d1;
                        d.data = d2;
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            var pos = d.data.labelArc.centroid(d2);
                            pos[0] = rradius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                            return [d.data.arc.centroid(d2),
                                d.data.labelArc.centroid(d2), pos];
                        };
                    });
                    polyline.exit().remove();
                }
            });
        };
        GPie.prototype.refreshDetailedLabel = function (slice) {
            var p1 = this.provider.dimension(0);
            var primlabel = p1.label(p1.items()[slice.data.index[0]], slice.data.primaryIndex);
            this.secondLabel.text(primlabel);
            var labels = this.labels_group.selectAll(".label");
            var label = labels.filter(function (d, i) { return slice.data.primaryIndex == i; });
            var texts = label.selectAll(".text-value");
            var text = texts.filter(function (d, i) { return slice.data.secondaryIndex == i; });
            var value = this.provider.dataText(slice.data.value, slice.data.index);
            var percent = Math.round((slice.endAngle - slice.startAngle) * 100 / 6.28);
            text.text(value + " (" + percent + "%)");
        };
        GPie.prototype.clearDetailedLabel = function (slice) {
            var labels = this.labels_group.selectAll(".label");
            var label = labels.filter(function (d, i) { return slice.data.primaryIndex == i; });
            var texts = label.selectAll(".text-value");
            var text = texts.filter(function (d, i) { return slice.data.secondaryIndex == i; });
            var value = this.provider.dataText(slice.data.value, slice.data.index);
            text.text(value);
            this.secondLabel.text("");
        };
        return GPie;
    }());
    exports.GPie = GPie;
});

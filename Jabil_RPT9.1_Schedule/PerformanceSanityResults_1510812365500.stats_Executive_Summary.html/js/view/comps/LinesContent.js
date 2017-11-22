define(["require", "exports", "view/query/queryUtil"], function (require, exports, qu) {
    "use strict";
    function sqrDistance(x, y, p) {
        var C = p.x - x;
        var D = p.y - y;
        return C * C + D * D;
    }
    function sqrLineDistance(x, y, p1, p2) {
        var A = x - p1.x;
        var B = y - p1.y;
        var C = p2.x - p1.x;
        var D = p2.y - p1.y;
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0)
            param = dot / len_sq;
        var xx, yy;
        if (param < 0) {
            xx = p1.x;
            yy = p1.y;
        }
        else if (param > 1) {
            xx = p2.x;
            yy = p2.y;
        }
        else {
            xx = p1.x + param * C;
            yy = p1.y + param * D;
        }
        var dx = x - xx;
        var dy = y - yy;
        return dx * dx + dy * dy;
    }
    function inRange(point, xrange, yrange) {
        if (point.x < xrange[0])
            return false;
        if (point.x > xrange[1])
            return false;
        if (point.y < yrange[1])
            return false;
        if (point.y > yrange[0])
            return false;
        return true;
    }
    function findClosestPoint(points, x, y, max, xrange, yrange) {
        if (points.length == 0)
            return -1;
        var sqrMax = max * max;
        if (points.length == 1) {
            var point = points[0];
            var d = sqrDistance(x, y, point);
            if (d > sqrMax)
                return -1;
            if (!inRange(point, xrange, yrange))
                return -1;
            return 0;
        }
        var size = points.length - 1;
        var closestSegment = -1;
        var closestSqrDistance = sqrMax;
        for (var i = 0; i < size; i++) {
            if (x - points[i + 1].x > max)
                continue;
            if (points[i].x - x > max)
                break;
            var d = sqrLineDistance(x, y, points[i], points[i + 1]);
            if (d <= closestSqrDistance) {
                closestSqrDistance = d;
                closestSegment = i;
            }
        }
        if (closestSegment == -1)
            return -1;
        var p1 = points[closestSegment];
        var p2 = points[closestSegment + 1];
        var d1 = inRange(p1, xrange, yrange) ? sqrDistance(x, y, p1) : Number.MAX_VALUE;
        var d2 = inRange(p2, xrange, yrange) ? sqrDistance(x, y, p2) : Number.MAX_VALUE;
        if (d1 < d2)
            return closestSegment;
        if (d2 < d1)
            return closestSegment + 1;
        if (d1 == Number.MAX_VALUE)
            return -1;
        return closestSegment;
    }
    function scalePoints(points, xscale, yscale) {
        var ret = new Array(points.length);
        for (var i = 0; i < points.length; i++) {
            ret[i] = { x: xscale(points[i].x), y: yscale(points[i].y) };
        }
        return ret;
    }
    var LinesContent = (function () {
        function LinesContent(provider, ornamentMatrix, xAxis, yAxis, clipName, lineSmoothing) {
            this.provider = provider;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.clipName = clipName;
            this.lineSmoothing = lineSmoothing;
            this.lineGens = this.createLineGenerators();
            this.colorProvider = ornamentMatrix.ornament(0);
            this.strokeProvider = ornamentMatrix.ornament(1);
        }
        LinesContent.prototype.renderContents = function (parent, width, height, monitoring) {
            var _this = this;
            this.height = height;
            this.parent = parent;
            this.parent.selectAll(".counter").remove();
            this.createCounterGroups();
            if (monitoring)
                this.provider.on("changed", function (event) { return _this.processChange(event); });
        };
        LinesContent.prototype.setLineSmoothing = function (value) {
            this.lineSmoothing = value;
            var evt = {
                dimensionsChanged: [],
                unitsChanged: true,
                xDomainChanged: true
            };
            this.processChange(evt);
        };
        LinesContent.prototype.processChange = function (event) {
            var groupsChanged = event.dimensionsChanged[1];
            var countersChanged = event.dimensionsChanged[0];
            if (event.unitsChanged) {
                this.lineGens = this.createLineGenerators();
            }
            if (groupsChanged || countersChanged) {
                var _this_1 = this;
                this.updateGroups(groupsChanged)
                    .each(function (p2item, groupIndex) {
                    var group = d3.select(this);
                    _this_1.updateCounters(group, groupIndex);
                });
            }
            if (event.xDomainChanged || event.domainChanged || event.dataChanged) {
                this.updateData(!event.majorChange);
            }
        };
        LinesContent.prototype.setSize = function (width, height, animate) {
            this.height = height;
            this.updateData(animate);
        };
        LinesContent.prototype.createCounterGroups = function () {
            var p1 = this.provider.dimension(1);
            var _this = this;
            this.parent.selectAll(".group")
                .data(p1.items(), p1.key())
                .enter().append("g")
                .classed("group", true)
                .each(function (p2item, groupIndex) {
                var group = d3.select(this);
                _this.createCounters(group, groupIndex);
                _this.showLonelyPoints(group, groupIndex);
            });
        };
        LinesContent.prototype.createCounters = function (group, groupIndex) {
            var _this = this;
            var p0 = this.provider.dimension(0);
            group.selectAll(".counter")
                .data(p0.items(), p0.key())
                .enter().append("g")
                .call(function (g) { return _this.setupCounter(g); })
                .append("path")
                .call(function (p) { return _this.setupLinePath(p, groupIndex, true, false); });
        };
        LinesContent.prototype.setupCounter = function (g) {
            var _this = this;
            var p0 = this.provider.dimension(0);
            g.classed("counter", true)
                .append("circle")
                .style("stroke", function (d, i) { return _this.colorProvider.color(i).toString(); })
                .style("fill", function (d, i) { return _this.colorProvider.color(i).toString(); })
                .attr("r", 3)
                .style("display", "none");
            g.append("circle").classed("lonelyPoint", true)
                .attr("r", 3)
                .style("stroke", function (d, i) { return _this.colorProvider.color(i).toString(); })
                .style("fill", function (d, i) { return _this.colorProvider.color(i).toString(); })
                .style("display", "none");
        };
        LinesContent.prototype.createLineGenerators = function () {
            var createLine;
            if (this.lineSmoothing) {
                createLine = function (xscale, yscale, provider) {
                    return d3.svg.line()
                        .interpolate("cardinal")
                        .tension(.85)
                        .x(function (point) { return xscale(point.x); })
                        .y(function (point) { return yscale(provider.dataValue(point.y)); });
                };
            }
            else {
                createLine = function (xscale, yscale, provider) {
                    return d3.svg.line()
                        .x(function (point) { return xscale(point.x); })
                        .y(function (point) { return yscale(provider.dataValue(point.y)); });
                };
            }
            var ret = new Array(this.provider.unitCount());
            var xscale = this.xAxis.scales[0];
            var yscales = this.yAxis.scales;
            for (var i = 0; i < this.provider.unitCount(); i++) {
                ret[i] = createLine(xscale, yscales[i], this.provider);
            }
            return ret;
        };
        LinesContent.prototype.updateData = function (animate) {
            var p0 = this.provider.dimension(0);
            var p1 = this.provider.dimension(1);
            var _this = this;
            this.parent.selectAll(".group")
                .data(p1.items(), p1.key())
                .each(function (p2item, groupIndex) {
                var group = d3.select(this);
                group.selectAll(".counter")
                    .data(p0.items(), p0.key())
                    .select("path")
                    .call(function (p) { return _this.setupLinePath(p, groupIndex, false, animate); });
                _this.showLonelyPoints(group, groupIndex);
            });
        };
        LinesContent.prototype.setupLinePath = function (p, groupIndex, create, animate) {
            var _this = this;
            var stroke = this.strokeProvider.stroke(groupIndex);
            var path = function (line, i) {
                var index = [i, groupIndex];
                var lineGenIndex = _this.provider.dataUnit(index);
                return _this.lineGens[lineGenIndex](_this.provider.data(index));
            };
            var tp;
            if (!animate) {
                if (create) {
                    p.classed("line", true)
                        .style("stroke", function (line, i) { return _this.colorProvider.color(i).toString(); })
                        .style("stroke-dasharray", stroke);
                    if (this.clipName) {
                        p.attr("clip-path", "url(#" + this.clipName + ")");
                    }
                }
                tp = p;
            }
            else {
                tp = p.transition();
            }
            tp.attr("d", path);
        };
        LinesContent.prototype.updateGroups = function (realChange) {
            var p1 = this.provider.dimension(1);
            var counterGroups = this.parent.selectAll(".group")
                .data(p1.items(), p1.key());
            if (realChange) {
                counterGroups.exit()
                    .remove();
                var newGroups = counterGroups.enter()
                    .append("g")
                    .classed("group", true);
                counterGroups.order();
                var _this_2 = this;
                newGroups.each(function (p2item, groupIndex) {
                    var group = d3.select(this);
                    _this_2.createCounters(group, groupIndex);
                });
            }
            return counterGroups;
        };
        LinesContent.prototype.updateCounters = function (group, groupIndex) {
            var _this = this;
            var p0 = this.provider.dimension(0);
            var p1 = this.provider.dimension(1);
            var counters = group
                .selectAll(".counter")
                .data(p0.items(), p0.key());
            counters.exit()
                .remove();
            var enterSel = counters.enter()
                .append("g")
                .call(function (g) { return _this.setupCounter(g); })
                .append("path")
                .call(function (p) { return _this.setupLinePath(p, groupIndex, true, false); });
            counters.order();
        };
        LinesContent.prototype.findCloseLines = function (x, y) {
            var p0 = this.provider.dimension(0);
            var p1 = this.provider.dimension(1);
            var tolerance = 15;
            var s1 = p0.size(), s2 = p1.size();
            var ret = qu.sameElementArrayF(s1, Array);
            var xscale = this.xAxis.scales[0];
            for (var i = 0; i < s1; i++) {
                for (var j = 0; j < s2; j++) {
                    var index = [i, j];
                    var yscale = this.yAxis.scales[this.provider.dataUnit(index)];
                    var domainPoints = this.provider.data(index);
                    var rangePoints = scalePoints(domainPoints, xscale, yscale);
                    var closestIndex = findClosestPoint(rangePoints, x, y, tolerance, xscale.range(), yscale.range());
                    if (closestIndex != -1) {
                        ret[i][j] = { x: rangePoints[closestIndex].x, y: rangePoints[closestIndex].y, index: closestIndex };
                    }
                }
            }
            return ret;
        };
        LinesContent.prototype.showLonelyPoints = function (group, groupIndex) {
            var provider = this.provider;
            var xscales = this.xAxis.scales;
            var yscales = this.yAxis.scales;
            this.parent.selectAll(".counter").select(".lonelyPoint")
                .each(function (d, i) {
                var point = d3.select(this);
                var index = [i, groupIndex];
                var values = provider.data(index);
                if (values.length == 1) {
                    point
                        .style("display", "initial")
                        .attr("cx", xscales[0](values[0].x))
                        .attr("cy", yscales[provider.dataUnit(index)](values[0].y));
                }
                else {
                    point.style("display", "none");
                }
            });
        };
        LinesContent.prototype.showPoints = function (points) {
            this.parent.selectAll(".group")
                .selectAll(".counter")
                .select("circle")
                .attr("cx", function (d, i, j) {
                var point = points[i][j];
                return point ? point.x : null;
            })
                .attr("cy", function (d, i, j) {
                var point = points[i][j];
                return point ? point.y : null;
            })
                .style("display", function (d, i, j) {
                var point = points[i][j];
                return point ? "initial" : "none";
            });
        };
        LinesContent.prototype.clearPoints = function () {
            this.parent.selectAll(".group")
                .selectAll(".counter")
                .select("circle")
                .style("display", "none");
        };
        return LinesContent;
    }());
    return LinesContent;
});

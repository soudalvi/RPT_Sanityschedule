define(["require", "exports", "view/query/queryUtil"], function (require, exports, qu) {
    "use strict";
    function sortLines(lines) {
        var ret = lines;
        for (var i = 0; i < lines.length; i++) {
            ret[i].unitIndex = i;
        }
        return ret.filter(function (m) { return m.lineIndex != null; }).sort(function (a, b) { return a.distance - b.distance; });
    }
    var HRECT = 50;
    var Projections = (function () {
        function Projections(provider, ornamentMatrix, xAxis, yAxis) {
            this.provider = provider;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.colorProvider = ornamentMatrix.ornament(0);
        }
        Projections.prototype.clearProjections = function () {
            if (this.xAxis)
                this.xAxis.dishighlightValues();
            if (this.yAxis) {
                this.yAxis.highlightAxes([]);
                this.yAxis.dishighlightValues();
            }
        };
        Projections.prototype.showProjections = function (points, mx, my) {
            var mins = sortLines(this.computeMinDistance(points, mx, my)).slice(0, this.yAxis.highlightableAxesCount());
            if (this.xAxis)
                this.xAxis.dishighlightValues();
            if (this.yAxis) {
                this.yAxis.dishighlightValues();
                this.yAxis.highlightAxes(mins.map(function (m) { return m.unitIndex; }));
            }
            for (var _i = 0, mins_1 = mins; _i < mins_1.length; _i++) {
                var m = mins_1[_i];
                this.showProjection(m.lineIndex, points, m.unitIndex);
            }
        };
        Projections.prototype.showProjection = function (index, points, unitIndex) {
            var point = points[index[0]][index[1]];
            var data = this.provider.data(index)[point.index];
            if (this.yAxis)
                this.yAxis.highlightValues(unitIndex, [data.y]);
            if (this.xAxis)
                this.xAxis.highlightValues(0, [data.x]);
        };
        Projections.prototype.computeMinDistance = function (points, mx, my) {
            var mins = qu.sameElementArray(this.provider.unitCount(), { lineIndex: null, distance: 150 });
            for (var i = 0; i < points.length; i++) {
                var ps = points[i];
                for (var j = 0; j < ps.length; j++) {
                    var point = ps[j];
                    if (!point)
                        continue;
                    var dx = point.x - mx;
                    var dy = point.y - my;
                    var d = dx * dx + dy * dy;
                    var unitIndex = this.provider.dataUnit([i, j]);
                    if (d < mins[unitIndex].distance) {
                        mins[unitIndex] = { lineIndex: [i, j], distance: d };
                    }
                }
            }
            return mins;
        };
        return Projections;
    }());
    return Projections;
});

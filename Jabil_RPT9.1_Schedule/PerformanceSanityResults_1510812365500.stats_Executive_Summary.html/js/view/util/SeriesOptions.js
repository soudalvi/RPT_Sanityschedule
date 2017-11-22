define(["require", "exports"], function (require, exports) {
    "use strict";
    function getOrCreateChild(parent, childName) {
        var child = $(parent).children(childName);
        if (child.length == 0) {
            var n = $.parseXML("<" + childName + "/>").documentElement;
            child = $(n).appendTo($(parent));
        }
        return child;
    }
    var SeriesOptions = (function () {
        function SeriesOptions(series) {
            this.series = [];
            this.legends = [];
            this.ids = series.ids;
            var size = this.ids.length;
            this.series = new Array(size);
            this.legends = new Array(size);
        }
        SeriesOptions.prototype.getIds = function () {
            return this.ids;
        };
        SeriesOptions.prototype.getLabels = function () {
            return this.labels;
        };
        SeriesOptions.prototype.serie = function (serie, dim, legend) {
            if (serie < 0 || serie >= this.ids.length)
                throw "Serie out of bound: " + serie;
            this.series[serie] = dim;
            this.legends[serie] = legend;
        };
        SeriesOptions.prototype.validate = function (originalDim) {
            if (originalDim > this.ids.length)
                throw "Unsupported dimensions count " + originalDim + " (max " + this.ids.length + ")";
            for (var d = 0; d < originalDim; d++) {
                var occ = 0;
                for (var s = 0; s < this.series.length; s++) {
                    if (this.series[s] == d)
                        occ++;
                }
                if (occ == 0)
                    throw "Dimension " + d + " is not assigned to a serie.";
                if (occ > 1)
                    throw "Dimension " + d + " is assigned to several series.";
            }
            return null;
        };
        SeriesOptions.prototype.size = function () {
            return this.ids.length;
        };
        SeriesOptions.prototype.cut = function (fromSerie) {
            this.ids = this.ids.slice(0, fromSerie);
            this.series.length = fromSerie;
            this.legends.length = fromSerie;
        };
        SeriesOptions.prototype.move = function (from, to) {
            this.series[to] = this.series[from];
            this.legends[to] = this.legends[from];
            this.series[from] = null;
            this.legends[from] = null;
        };
        SeriesOptions.prototype.useLegend = function () {
            return this.legends.some(function (l) { return l; });
        };
        SeriesOptions.prototype.allLegendsOn = function (state) {
            for (var i = 0; i < this.legends.length; i++) {
                this.legends[i] = state;
            }
        };
        SeriesOptions.prototype.applyOptions = function (options, dimIds, acceptableDimIds) {
            for (var _i = 0, dimIds_1 = dimIds; _i < dimIds_1.length; _i++) {
                var d = dimIds_1[_i];
                var occ = 0;
                for (var s in options.series) {
                    if (options.series[s].dim == d)
                        occ++;
                }
                if (occ == 0)
                    throw "Dimension " + d + " is not assigned to a serie.";
                if (occ > 1)
                    throw "Dimension " + d + " is assigned to several series.";
            }
            for (var serie in options.series) {
                var serieIndex = this.ids.indexOf(serie);
                if (serieIndex == -1)
                    throw "Serie " + serie + " not defined";
                var val = options.series[serie];
                if (val.dim) {
                    var dimIndex = dimIds.indexOf(val.dim);
                    if (dimIndex != -1) {
                        this.series[serieIndex] = dimIndex;
                        if (val.legend != null) {
                            this.legends[serieIndex] = val.legend;
                        }
                    }
                    else if (acceptableDimIds.indexOf(val.dim) == -1) {
                        throw "Dimension " + val.dim + " not defined";
                    }
                    else {
                        this.series[serieIndex] = null;
                        this.legends[serieIndex] = false;
                    }
                }
            }
        };
        return SeriesOptions;
    }());
    exports.SeriesOptions = SeriesOptions;
    var SeriesOptionsModel = (function () {
        function SeriesOptionsModel() {
            this.series = {};
        }
        SeriesOptionsModel.prototype.set = function (serie, dim, legend) {
            this.series[serie] = { dim: dim, legend: legend };
        };
        SeriesOptionsModel.prototype.getDimension = function (serie) {
            var s = this.series[serie];
            return s ? s.dim : null;
        };
        SeriesOptionsModel.prototype.setDimension = function (serie, dim) {
            var oldDim = this.series[serie] ? this.series[serie].dim : null;
            for (var s in this.series) {
                if (this.series[s].dim == dim)
                    this.series[s].dim = oldDim;
            }
            if (dim) {
                if (!this.series[serie])
                    this.series[serie] = { dim: dim, legend: null };
                else
                    this.series[serie].dim = dim;
            }
            else {
                delete this.series[serie];
            }
        };
        SeriesOptionsModel.prototype.save = function (parent) {
            var series = getOrCreateChild(parent, "series");
            series.children().remove();
            for (var s in this.series) {
                var options = this.series[s];
                getOrCreateChild(series, s)
                    .attr("dim", options.dim)
                    .attr("legend", options.legend ? "true" : "false");
            }
        };
        SeriesOptionsModel.create = function (parent) {
            var series = $(parent).children("series");
            if (series.length == 0)
                return null;
            var ret = new SeriesOptionsModel();
            $(series[0]).children().each(function () {
                var legend = $(this).attr("legend");
                ret.set(this.nodeName, $(this).attr("dim"), legend !== null ? legend == "true" : null);
            });
            return ret;
        };
        return SeriesOptionsModel;
    }());
    exports.SeriesOptionsModel = SeriesOptionsModel;
});

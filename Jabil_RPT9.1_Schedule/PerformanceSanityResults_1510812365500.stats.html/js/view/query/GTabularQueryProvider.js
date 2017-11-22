var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GMatrixQueryProvider", "view/query/queryUtil"], function (require, exports, GMatrixQueryProvider, qu) {
    "use strict";
    var GTabularQueryProvider = (function (_super) {
        __extends(GTabularQueryProvider, _super);
        function GTabularQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
        }
        GTabularQueryProvider.prototype.counterQuerySetChanged = function (reordering) {
            _super.prototype.counterQuerySetChanged.call(this, reordering);
            this.countersReordered(reordering);
            var dimChanged = [];
            dimChanged[this.countersDimIndex] = true;
            this.changed({
                unitsChanged: true,
                dimensionsChanged: dimChanged,
                majorChange: reordering.hasAddedElements()
            });
            if (reordering.hasAddedElements()) {
                this.update(true);
            }
        };
        GTabularQueryProvider.prototype.dataUnit = function (index) {
            return this.counterQueries[index[this.countersDimIndex]].unitIndex;
        };
        GTabularQueryProvider.prototype.dataUnits = function (indices) {
            var counterIndices = indices[this.countersDimIndex];
            if (!counterIndices)
                return undefined;
            var ret = [];
            for (var _i = 0, counterIndices_1 = counterIndices; _i < counterIndices_1.length; _i++) {
                var i = counterIndices_1[_i];
                var u = this.counterQueries[i].unitIndex;
                if (ret.indexOf(u) == -1)
                    ret.push(u);
            }
            return ret;
        };
        GTabularQueryProvider.prototype.unitDomain = function (unitIndex) {
            var unit = this.units[unitIndex];
            if (!this.values)
                return unit.defaultRange();
            var filter = [];
            filter[this.dims.length - 1 - this.dims[this.countersDimIndex]] = unit.counterIndices;
            return qu.uextent(unit, this.values, this.dims.length, filter);
        };
        GTabularQueryProvider.prototype.getIndexFilter = function (unit, indices) {
            var filter = [];
            for (var i = 0; i < this.dims.length; i++) {
                var f = indices[i];
                if (i == this.countersDimIndex)
                    f = unit.getCounterIndices(f);
                filter[this.dims.length - 1 - this.dims[i]] = f;
            }
            return filter;
        };
        GTabularQueryProvider.prototype.dataDomain = function (unitIndex, indices) {
            var unit = this.units[unitIndex];
            if (!this.values)
                return unit.defaultRange();
            var filter = this.getIndexFilter(unit, indices);
            return qu.uextent(unit, this.values, this.dims.length, filter);
        };
        GTabularQueryProvider.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            var unit = this.units[unitIndex];
            if (!this.values)
                return unit.defaultRange();
            var filter = this.getIndexFilter(unit, indices);
            return qu.usextent(unit, this.values, this.dims.length, this.dims.length - 1 - this.dims[consolidatedDim], filter);
        };
        GTabularQueryProvider.prototype.data = function (index) {
            if (!this.values)
                return undefined;
            var v = this.values;
            for (var _i = 0, _a = this.dims; _i < _a.length; _i++) {
                var dim = _a[_i];
                v = v[index[dim]];
                if (v === undefined || v === null)
                    return undefined;
            }
            return v;
        };
        GTabularQueryProvider.prototype.dataValue = function (data) {
            return data !== undefined ? data : null;
        };
        GTabularQueryProvider.prototype.dataText = function (data, index) {
            return this.counterQueries[index[this.countersDimIndex]].displayValue(data);
        };
        GTabularQueryProvider.prototype.countersReordered = function (reordering) {
            if (this.values)
                this.values = reordering.applyDeep(this.values, this.countersDimIndex, null);
        };
        return GTabularQueryProvider;
    }(GMatrixQueryProvider));
    exports.GTabularQueryProvider = GTabularQueryProvider;
});

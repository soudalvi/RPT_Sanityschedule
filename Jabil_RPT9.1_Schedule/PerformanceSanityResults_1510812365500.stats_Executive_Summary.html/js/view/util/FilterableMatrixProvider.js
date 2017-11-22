var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "view/util/ItemFilter", "view/util/FilterableDimensionProvider"], function (require, exports, Evented, ItemFilter_1, FilterableDimensionProvider_1) {
    "use strict";
    var FilterableMatrixProvider = (function (_super) {
        __extends(FilterableMatrixProvider, _super);
        function FilterableMatrixProvider(provider, filterableDimensions, scaleOnSelection, ornamentMatrix) {
            var _this = this;
            _super.call(this);
            this.provider = provider;
            this.scaleOnSelection = scaleOnSelection;
            this.unitFilter = new ItemFilter_1.ItemFilter(provider.unitCount());
            provider.on("changed", function (event) { return _this.changed(event); });
            this.dimensions = new Array(provider.dimensionsCount());
            this.ornaments = new Array(provider.dimensionsCount());
            var _loop_1 = function(dim) {
                if (filterableDimensions[dim]) {
                    var dimension = new FilterableDimensionProvider_1.FilterableDimensionProvider(provider, dim);
                    dimension.on("legendSelectionChanged", function () { return _this.legendSelectionChanged(dim); });
                    this_1.dimensions[dim] = dimension;
                    this_1.ornaments[dim] = dimension.ornament(ornamentMatrix.ornament(dim));
                }
                else {
                    this_1.ornaments[dim] = ornamentMatrix.ornament(dim);
                }
            };
            var this_1 = this;
            for (var dim = 0; dim < this.dimensions.length; dim++) {
                _loop_1(dim);
            }
        }
        FilterableMatrixProvider.prototype.on = function (type, listener) {
            var h1 = _super.prototype.on.call(this, type, listener);
            if (type != "changed")
                return h1;
            var h2 = this.provider.on("changed", listener);
            return {
                remove: function () { h1.remove(); h2.remove(); }
            };
        };
        FilterableMatrixProvider.prototype.changed = function (event) {
            if (event.unitsChanged) {
                this.unitFilter = new ItemFilter_1.ItemFilter(this.provider.unitCount());
            }
            for (var i = 0; i < this.dimensions.length; i++) {
                var dim = this.dimensions[i];
                if (dim && event.dimensionsChanged[i]) {
                    dim.itemsChanged();
                }
            }
        };
        FilterableMatrixProvider.prototype.legendSelectionChanged = function (dim) {
            var unitAffected = this.provider.variableUnit(dim);
            if (unitAffected) {
                unitAffected = this.updateUnitFilter();
            }
            var dimChanged = [];
            dimChanged[dim] = true;
            this.emit("changed", {
                domainChanged: this.scaleOnSelection,
                dimensionsChanged: dimChanged,
                unitsChanged: unitAffected
            });
        };
        FilterableMatrixProvider.prototype.updateUnitFilter = function () {
            var _this = this;
            var indexFilter = this.dimensions.map(function (d, i) { return d && _this.provider.variableUnit(i) ? d.filter.unfilteredIndices() : undefined; });
            if (indexFilter.every(function (indices) { return indices === undefined; })) {
                if (this.unitFilter.isFull())
                    return false;
                this.unitFilter.addAll();
                return true;
            }
            else {
                var units = this.provider.dataUnits(indexFilter);
                return this.unitFilter.updateSelected(units);
            }
        };
        FilterableMatrixProvider.prototype.dataValue = function (data) {
            return this.provider.dataValue(data);
        };
        FilterableMatrixProvider.prototype.unitCount = function () {
            return this.unitFilter.size();
        };
        FilterableMatrixProvider.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(this.originalUnit(unitIndex));
        };
        FilterableMatrixProvider.prototype.unitDomain = function (unitIndex) {
            unitIndex = this.originalUnit(unitIndex);
            if (!this.scaleOnSelection) {
                return this.provider.unitDomain(unitIndex);
            }
            else {
                return this.provider.dataDomain(unitIndex, this.selectedIndices());
            }
        };
        FilterableMatrixProvider.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(this.originalUnit(unitIndex), domain);
        };
        FilterableMatrixProvider.prototype.dimensionsCount = function () {
            return this.dimensions.length;
        };
        FilterableMatrixProvider.prototype.dimension = function (dim) {
            var d = this.dimensions[dim];
            return d ? d : this.provider.dimension(dim);
        };
        FilterableMatrixProvider.prototype.variableUnit = function (dim) {
            return this.provider.variableUnit(dim);
        };
        FilterableMatrixProvider.prototype.legendDimension = function (dim) {
            return this.dimensions[dim];
        };
        FilterableMatrixProvider.prototype.dataUnit = function (index) {
            return this.unitFilter.filteredIndex(this.provider.dataUnit(this.originalIndex(index)));
        };
        FilterableMatrixProvider.prototype.dataUnits = function (indices) {
            return this.unitFilter.filteredIndices(this.provider.dataUnits(this.originalIndices(indices)));
        };
        FilterableMatrixProvider.prototype.dataText = function (data, index) {
            return this.provider.dataText(data, this.originalIndex(index));
        };
        FilterableMatrixProvider.prototype.dataDomain = function (unitIndex, indices) {
            if (this.scaleOnSelection) {
                indices = this.originalIndices(indices);
            }
            return this.provider.dataDomain(this.originalUnit(unitIndex), indices);
        };
        FilterableMatrixProvider.prototype.getActions = function (index) {
            return this.provider.getActions(this.originalIndex(index));
        };
        FilterableMatrixProvider.prototype.ornament = function (dim) {
            return this.ornaments[dim];
        };
        FilterableMatrixProvider.prototype.selectedIndices = function () {
            var li = [];
            for (var i = 0; i < this.dimensions.length; i++) {
                var dim = this.dimensions[i];
                li[i] = dim ? dim.legendItemIndices() : undefined;
            }
            return li;
        };
        FilterableMatrixProvider.prototype.originalIndex = function (index) {
            var li = [];
            for (var i = 0; i < this.dimensions.length; i++) {
                var dim = this.dimensions[i];
                li[i] = dim ? dim.sourceIndex(index[i]) : index[i];
            }
            return li;
        };
        FilterableMatrixProvider.prototype.originalIndices = function (indices) {
            var li = [];
            for (var i = 0; i < this.dimensions.length; i++) {
                var dim = this.dimensions[i];
                li[i] = dim ? dim.legendItemIndices(indices[i]) : undefined;
            }
            return li;
        };
        FilterableMatrixProvider.prototype.originalUnit = function (index) {
            return this.unitFilter.index(index);
        };
        return FilterableMatrixProvider;
    }(Evented));
    exports.FilterableMatrixProvider = FilterableMatrixProvider;
    var FilterableTabularProvider = (function (_super) {
        __extends(FilterableTabularProvider, _super);
        function FilterableTabularProvider(provider, filterableDimensions, scaleOnSelection, ornamentMatrix) {
            _super.call(this, provider, filterableDimensions, scaleOnSelection, ornamentMatrix);
        }
        FilterableTabularProvider.prototype.data = function (index) {
            return this.provider.data(this.originalIndex(index));
        };
        FilterableTabularProvider.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            if (this.scaleOnSelection) {
                indices = this.originalIndices(indices);
            }
            return this.provider.dataConsolidatedDomain(this.originalUnit(unitIndex), indices, consolidatedDim);
        };
        return FilterableTabularProvider;
    }(FilterableMatrixProvider));
    exports.FilterableTabularProvider = FilterableTabularProvider;
    var FilterableLinesProvider = (function (_super) {
        __extends(FilterableLinesProvider, _super);
        function FilterableLinesProvider(provider, filterableDimensions, scaleOnSelection, ornamentMatrix) {
            _super.call(this, provider, filterableDimensions, scaleOnSelection, ornamentMatrix);
        }
        FilterableLinesProvider.prototype.xLabel = function () {
            return this.provider.xLabel();
        };
        FilterableLinesProvider.prototype.xDomain = function () {
            return this.provider.xDomain();
        };
        FilterableLinesProvider.prototype.xScale = function (domain) {
            return this.provider.xScale(domain);
        };
        FilterableLinesProvider.prototype.data = function (index) {
            return this.provider.data(this.originalIndex(index));
        };
        return FilterableLinesProvider;
    }(FilterableMatrixProvider));
    exports.FilterableLinesProvider = FilterableLinesProvider;
    var FilterableVariableLinesProvider = (function (_super) {
        __extends(FilterableVariableLinesProvider, _super);
        function FilterableVariableLinesProvider() {
            _super.apply(this, arguments);
        }
        FilterableVariableLinesProvider.prototype.setXDomain = function (domain) {
            this.provider.setXDomain(domain);
        };
        FilterableVariableLinesProvider.prototype.getXDomain = function () {
            return this.provider.getXDomain();
        };
        FilterableVariableLinesProvider.prototype.getFixedProvider = function () {
            var ret = this.provider.getFixedProvider();
            return ret;
        };
        return FilterableVariableLinesProvider;
    }(FilterableLinesProvider));
    exports.FilterableVariableLinesProvider = FilterableVariableLinesProvider;
});

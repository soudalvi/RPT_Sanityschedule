var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var GDimensionReducer = (function () {
        function GDimensionReducer(provider, fixedItems) {
            this.dim = provider.dimensionsCount() - fixedItems.length;
            this.fixed = fixedItems;
            this.provider = provider;
        }
        GDimensionReducer.prototype.on = function (type, listener) {
            return this.provider.on("changed", listener);
        };
        GDimensionReducer.prototype.dimensionsCount = function () {
            return this.dim;
        };
        GDimensionReducer.prototype.dimension = function (dim) {
            if (dim <= this.dim)
                return this.provider.dimension(dim);
            return undefined;
        };
        GDimensionReducer.prototype.variableUnit = function (dim) {
            if (dim <= this.dim)
                return this.provider.variableUnit(dim);
            return false;
        };
        GDimensionReducer.prototype.dataUnit = function (index) {
            return this.provider.dataUnit(this.fixate(index));
        };
        GDimensionReducer.prototype.dataUnits = function (indices) {
            return this.provider.dataUnits(this.fixate(indices));
        };
        GDimensionReducer.prototype.dataText = function (data, index) {
            return this.provider.dataText(data, this.fixate(index));
        };
        GDimensionReducer.prototype.dataDomain = function (unitIndex, indices) {
            return this.provider.dataDomain(unitIndex, this.fixate(indices));
        };
        GDimensionReducer.prototype.getActions = function (index) {
            return this.provider.getActions(this.fixate(index));
        };
        GDimensionReducer.prototype.dataValue = function (data) {
            return this.provider.dataValue(data);
        };
        GDimensionReducer.prototype.unitCount = function () {
            return this.provider.unitCount();
        };
        GDimensionReducer.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(unitIndex);
        };
        GDimensionReducer.prototype.unitDomain = function (unitIndex) {
            return this.provider.unitDomain(unitIndex);
        };
        GDimensionReducer.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(unitIndex, domain);
        };
        GDimensionReducer.prototype.fixate = function (index) {
            return [].concat(index).concat(this.fixed);
        };
        return GDimensionReducer;
    }());
    exports.GDimensionReducer = GDimensionReducer;
    var GTabularDimensionReducer = (function (_super) {
        __extends(GTabularDimensionReducer, _super);
        function GTabularDimensionReducer(provider, fixedItems) {
            _super.call(this, provider, fixedItems);
        }
        GTabularDimensionReducer.prototype.data = function (index) {
            return this.provider.data(this.fixate(index));
        };
        GTabularDimensionReducer.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            return this.provider.dataConsolidatedDomain(unitIndex, this.fixate(indices), consolidatedDim);
        };
        return GTabularDimensionReducer;
    }(GDimensionReducer));
    exports.GTabularDimensionReducer = GTabularDimensionReducer;
    var GLinesDimensionReducer = (function (_super) {
        __extends(GLinesDimensionReducer, _super);
        function GLinesDimensionReducer(provider, fixedItems) {
            _super.call(this, provider, fixedItems);
        }
        GLinesDimensionReducer.prototype.xLabel = function () {
            return this.provider.xLabel();
        };
        GLinesDimensionReducer.prototype.xDomain = function () {
            return this.provider.xDomain();
        };
        GLinesDimensionReducer.prototype.xScale = function (domain) {
            return this.provider.xScale(domain);
        };
        GLinesDimensionReducer.prototype.data = function (index) {
            return this.provider.data(this.fixate(index));
        };
        return GLinesDimensionReducer;
    }(GDimensionReducer));
    exports.GLinesDimensionReducer = GLinesDimensionReducer;
    var GVariableLinesDimensionReducer = (function (_super) {
        __extends(GVariableLinesDimensionReducer, _super);
        function GVariableLinesDimensionReducer(provider, fixedItems) {
            _super.call(this, provider, fixedItems);
        }
        GVariableLinesDimensionReducer.prototype.setXDomain = function (domain) {
            this.provider.setXDomain(domain);
        };
        GVariableLinesDimensionReducer.prototype.getXDomain = function () {
            return this.provider.getXDomain();
        };
        GVariableLinesDimensionReducer.prototype.getFixedProvider = function () {
            var p = this.provider.getFixedProvider();
            return new GLinesDimensionReducer(p, this.fixed);
        };
        return GVariableLinesDimensionReducer;
    }(GLinesDimensionReducer));
    exports.GVariableLinesDimensionReducer = GVariableLinesDimensionReducer;
});

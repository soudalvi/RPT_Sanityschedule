var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/queryUtil"], function (require, exports, qu) {
    "use strict";
    var UnitSplitter = (function () {
        function UnitSplitter(provider, splitDim) {
            this.provider = provider;
            this.splitDim = splitDim;
        }
        UnitSplitter.prototype.on = function (type, listener) {
            var _this = this;
            return this.provider.on("changed", function (event) { return listener(_this.translateEvent(event)); });
        };
        UnitSplitter.prototype.translateEvent = function (event) {
            var ret = {
                majorChange: event.majorChange,
                unitsChanged: event.unitsChanged || event.dimensionsChanged[this.splitDim],
                domainChanged: event.domainChanged,
                dataChanged: event.dataChanged,
                dimensionsChanged: event.dimensionsChanged
            };
            return ret;
        };
        UnitSplitter.prototype.dimensionsCount = function () {
            return this.provider.dimensionsCount();
        };
        UnitSplitter.prototype.dimension = function (dim) {
            return this.provider.dimension(dim);
        };
        UnitSplitter.prototype.variableUnit = function (dim) {
            if (dim == this.splitDim)
                return true;
            return this.provider.variableUnit(dim);
        };
        UnitSplitter.prototype.dataText = function (data, index) {
            return this.provider.dataText(data, index);
        };
        UnitSplitter.prototype.getActions = function (index) {
            return this.provider.getActions(index);
        };
        UnitSplitter.prototype.dataValue = function (data) {
            return this.provider.dataValue(data);
        };
        return UnitSplitter;
    }());
    var IndependentUnitSplitter = (function (_super) {
        __extends(IndependentUnitSplitter, _super);
        function IndependentUnitSplitter() {
            _super.apply(this, arguments);
        }
        IndependentUnitSplitter.prototype.dataUnit = function (index) {
            var itemIndex = index[this.splitDim];
            return itemIndex * this.provider.unitCount() + this.provider.dataUnit(index);
        };
        IndependentUnitSplitter.prototype.dataUnits = function (indices) {
            var itemIndices = indices[this.splitDim];
            var unitIndices = this.provider.dataUnits(indices);
            if (!itemIndices && !unitIndices)
                return undefined;
            var s = this.provider.unitCount();
            var ret = [];
            if (itemIndices) {
                for (var i = 0, k = 0; i < itemIndices.length; i++) {
                    if (unitIndices) {
                        for (var j = 0; j < unitIndices.length; j++, k++) {
                            ret[k] = itemIndices[i] * s + unitIndices[j];
                        }
                    }
                    else {
                        for (var j = 0; j < s; j++, k++) {
                            ret[k] = itemIndices[i] * s + j;
                        }
                    }
                }
            }
            else {
                var l = this.provider.dimension(this.splitDim).size();
                for (var i = 0, k = 0; i < l; i++) {
                    for (var j = 0; j < unitIndices.length; j++, k++) {
                        ret[k] = i * s + unitIndices[j];
                    }
                }
            }
            return ret;
        };
        IndependentUnitSplitter.prototype.dataDomain = function (unitIndex, indices) {
            var count = this.provider.unitCount();
            var itemIndex = (unitIndex / count) | 0;
            unitIndex = unitIndex % count;
            var f = indices[this.splitDim];
            if (f && f.indexOf(itemIndex) == -1)
                f = [];
            else
                f = [itemIndex];
            indices[this.splitDim] = f;
            return this.provider.dataDomain(unitIndex, indices);
        };
        IndependentUnitSplitter.prototype.unitCount = function () {
            return this.provider.dimension(this.splitDim).size() * this.provider.unitCount();
        };
        IndependentUnitSplitter.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(unitIndex % this.provider.unitCount());
        };
        IndependentUnitSplitter.prototype.unitDomain = function (unitIndex) {
            var count = this.provider.unitCount();
            var itemIndex = (unitIndex / count) | 0;
            unitIndex = unitIndex % count;
            var filter = [];
            filter[this.splitDim] = [itemIndex];
            return this.provider.dataDomain(unitIndex, filter);
        };
        IndependentUnitSplitter.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(unitIndex % this.provider.unitCount(), domain);
        };
        return IndependentUnitSplitter;
    }(UnitSplitter));
    var DependentUnitSplitter = (function (_super) {
        __extends(DependentUnitSplitter, _super);
        function DependentUnitSplitter() {
            _super.apply(this, arguments);
        }
        DependentUnitSplitter.prototype.originalUnit = function (itemIndex) {
            var index = qu.sameElementArray(this.provider.dimensionsCount(), 0);
            index[this.splitDim] = itemIndex;
            return this.provider.dataUnit(index);
        };
        DependentUnitSplitter.prototype.dataUnit = function (index) {
            return index[this.splitDim];
        };
        DependentUnitSplitter.prototype.dataUnits = function (indices) {
            return indices[this.splitDim];
        };
        DependentUnitSplitter.prototype.dataDomain = function (unitIndex, indices) {
            var f = indices[this.splitDim];
            if (f && f.indexOf(unitIndex) == -1)
                f = [];
            else
                f = [unitIndex];
            indices[this.splitDim] = f;
            return this.provider.dataDomain(this.originalUnit(unitIndex), indices);
        };
        DependentUnitSplitter.prototype.unitCount = function () {
            return this.provider.dimension(this.splitDim).size();
        };
        DependentUnitSplitter.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(this.originalUnit(unitIndex));
        };
        DependentUnitSplitter.prototype.unitDomain = function (unitIndex) {
            var filter = [];
            filter[this.splitDim] = [unitIndex];
            return this.provider.dataDomain(this.originalUnit(unitIndex), filter);
        };
        DependentUnitSplitter.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(this.originalUnit(unitIndex), domain);
        };
        return DependentUnitSplitter;
    }(UnitSplitter));
    var TabularIndependentUnitSplitter = (function (_super) {
        __extends(TabularIndependentUnitSplitter, _super);
        function TabularIndependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        TabularIndependentUnitSplitter.prototype.data = function (index) {
            return this.provider.data(index);
        };
        TabularIndependentUnitSplitter.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            var count = this.provider.unitCount();
            var itemIndex = (unitIndex / count) | 0;
            unitIndex = unitIndex % count;
            var f = indices[this.splitDim];
            if (f && f.indexOf(itemIndex) == -1)
                f = [];
            else
                f = [itemIndex];
            indices[this.splitDim] = f;
            return this.provider.dataConsolidatedDomain(unitIndex, indices, consolidatedDim);
        };
        return TabularIndependentUnitSplitter;
    }(IndependentUnitSplitter));
    exports.TabularIndependentUnitSplitter = TabularIndependentUnitSplitter;
    var TabularDependentUnitSplitter = (function (_super) {
        __extends(TabularDependentUnitSplitter, _super);
        function TabularDependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        TabularDependentUnitSplitter.prototype.data = function (index) {
            return this.provider.data(index);
        };
        TabularDependentUnitSplitter.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            var f = indices[this.splitDim];
            if (f && f.indexOf(unitIndex) == -1)
                f = [];
            else
                f = [unitIndex];
            indices[this.splitDim] = f;
            return this.provider.dataConsolidatedDomain(this.originalUnit(unitIndex), indices, consolidatedDim);
        };
        return TabularDependentUnitSplitter;
    }(DependentUnitSplitter));
    exports.TabularDependentUnitSplitter = TabularDependentUnitSplitter;
    var LineIndependentUnitSplitter = (function (_super) {
        __extends(LineIndependentUnitSplitter, _super);
        function LineIndependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        LineIndependentUnitSplitter.prototype.translateEvent = function (event) {
            var ret = _super.prototype.translateEvent.call(this, event);
            ret.xDomainChanged = event.xDomainChanged;
            return ret;
        };
        LineIndependentUnitSplitter.prototype.xLabel = function () {
            return this.provider.xLabel();
        };
        LineIndependentUnitSplitter.prototype.xDomain = function () {
            return this.provider.xDomain();
        };
        LineIndependentUnitSplitter.prototype.xScale = function (domain) {
            return this.provider.xScale(domain);
        };
        LineIndependentUnitSplitter.prototype.data = function (index) {
            return this.provider.data(index);
        };
        return LineIndependentUnitSplitter;
    }(IndependentUnitSplitter));
    exports.LineIndependentUnitSplitter = LineIndependentUnitSplitter;
    var LineDependentUnitSplitter = (function (_super) {
        __extends(LineDependentUnitSplitter, _super);
        function LineDependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        LineDependentUnitSplitter.prototype.translateEvent = function (event) {
            var ret = _super.prototype.translateEvent.call(this, event);
            ret.xDomainChanged = event.xDomainChanged;
            return ret;
        };
        LineDependentUnitSplitter.prototype.xLabel = function () {
            return this.provider.xLabel();
        };
        LineDependentUnitSplitter.prototype.xDomain = function () {
            return this.provider.xDomain();
        };
        LineDependentUnitSplitter.prototype.xScale = function (domain) {
            return this.provider.xScale(domain);
        };
        LineDependentUnitSplitter.prototype.data = function (index) {
            return this.provider.data(index);
        };
        return LineDependentUnitSplitter;
    }(DependentUnitSplitter));
    exports.LineDependentUnitSplitter = LineDependentUnitSplitter;
    var VariableLineIndependentUnitSplitter = (function (_super) {
        __extends(VariableLineIndependentUnitSplitter, _super);
        function VariableLineIndependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        VariableLineIndependentUnitSplitter.prototype.setXDomain = function (domain) {
            this.provider.setXDomain(domain);
        };
        VariableLineIndependentUnitSplitter.prototype.getXDomain = function () {
            return this.provider.getXDomain();
        };
        VariableLineIndependentUnitSplitter.prototype.getFixedProvider = function () {
            var p = this.provider.getFixedProvider();
            return new LineIndependentUnitSplitter(p, this.splitDim);
        };
        return VariableLineIndependentUnitSplitter;
    }(LineIndependentUnitSplitter));
    exports.VariableLineIndependentUnitSplitter = VariableLineIndependentUnitSplitter;
    var VariableLineDependentUnitSplitter = (function (_super) {
        __extends(VariableLineDependentUnitSplitter, _super);
        function VariableLineDependentUnitSplitter(provider, splitDim) {
            _super.call(this, provider, splitDim);
        }
        VariableLineDependentUnitSplitter.prototype.setXDomain = function (domain) {
            this.provider.setXDomain(domain);
        };
        VariableLineDependentUnitSplitter.prototype.getXDomain = function () {
            return this.provider.getXDomain();
        };
        VariableLineDependentUnitSplitter.prototype.getFixedProvider = function () {
            var p = this.provider.getFixedProvider();
            return new LineDependentUnitSplitter(p, this.splitDim);
        };
        return VariableLineDependentUnitSplitter;
    }(LineDependentUnitSplitter));
    exports.VariableLineDependentUnitSplitter = VariableLineDependentUnitSplitter;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var GMatrixSwapper = (function () {
        function GMatrixSwapper(provider, newOrder) {
            if (newOrder.length < provider.dimensionsCount())
                throw "Cannot reduce the dimensions count";
            this.newOrder = newOrder;
            this.provider = provider;
            this.o2a = [];
            this.dimensions = [];
            for (var i = 0; i < newOrder.length; i++) {
                var dim = newOrder[i];
                if (dim == null) {
                    this.dimensions.push(new OneItemDimension());
                }
                else {
                    this.dimensions.push(provider.dimension(dim));
                    this.o2a[dim] = i;
                }
            }
        }
        GMatrixSwapper.prototype.on = function (type, listener) {
            var _this = this;
            return this.provider.on("changed", function (event) { return listener(_this.translateEvent(event)); });
        };
        GMatrixSwapper.prototype.translateEvent = function (event) {
            var ret = {
                majorChange: event.majorChange,
                unitsChanged: event.unitsChanged,
                domainChanged: event.domainChanged,
                dataChanged: event.dataChanged,
                dimensionsChanged: []
            };
            for (var i = 0; i < this.o2a.length; i++) {
                if (event.dimensionsChanged[i])
                    ret.dimensionsChanged[this.o2a[i]] = true;
            }
            return ret;
        };
        GMatrixSwapper.prototype.dimensionsCount = function () {
            return this.dimensions.length;
        };
        GMatrixSwapper.prototype.dimension = function (dim) {
            return this.dimensions[dim];
        };
        GMatrixSwapper.prototype.variableUnit = function (dim) {
            var origDim = this.newOrder[dim];
            if (origDim == undefined)
                return false;
            return this.provider.variableUnit(origDim);
        };
        GMatrixSwapper.prototype.dataUnit = function (index) {
            return this.provider.dataUnit(this.original(index));
        };
        GMatrixSwapper.prototype.dataUnits = function (indices) {
            return this.provider.dataUnits(this.original(indices));
        };
        GMatrixSwapper.prototype.dataText = function (data, index) {
            return this.provider.dataText(data, this.original(index));
        };
        GMatrixSwapper.prototype.dataDomain = function (unitIndex, indices) {
            return this.provider.dataDomain(unitIndex, this.original(indices));
        };
        GMatrixSwapper.prototype.getActions = function (index) {
            return this.provider.getActions(this.original(index));
        };
        GMatrixSwapper.prototype.dataValue = function (data) {
            return this.provider.dataValue(data);
        };
        GMatrixSwapper.prototype.unitCount = function () {
            return this.provider.unitCount();
        };
        GMatrixSwapper.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(unitIndex);
        };
        GMatrixSwapper.prototype.unitDomain = function (unitIndex) {
            return this.provider.unitDomain(unitIndex);
        };
        GMatrixSwapper.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(unitIndex, domain);
        };
        GMatrixSwapper.prototype.original = function (apparent) {
            var ois = [];
            for (var i = 0; i < this.o2a.length; i++) {
                ois[i] = apparent[this.o2a[i]];
            }
            return ois;
        };
        return GMatrixSwapper;
    }());
    exports.GMatrixSwapper = GMatrixSwapper;
    var GTabularSwapper = (function (_super) {
        __extends(GTabularSwapper, _super);
        function GTabularSwapper(provider, newOrder) {
            _super.call(this, provider, newOrder);
        }
        GTabularSwapper.prototype.data = function (index) {
            return this.provider.data(this.original(index));
        };
        GTabularSwapper.prototype.dataConsolidatedDomain = function (unitIndex, indices, consolidatedDim) {
            consolidatedDim = this.newOrder[consolidatedDim];
            if (consolidatedDim == null) {
                return this.provider.dataDomain(unitIndex, this.original(indices));
            }
            return this.provider.dataConsolidatedDomain(unitIndex, this.original(indices), consolidatedDim);
        };
        return GTabularSwapper;
    }(GMatrixSwapper));
    exports.GTabularSwapper = GTabularSwapper;
    var GLinesSwapper = (function (_super) {
        __extends(GLinesSwapper, _super);
        function GLinesSwapper(provider, newOrder) {
            _super.call(this, provider, newOrder);
        }
        GLinesSwapper.prototype.xLabel = function () {
            return this.provider.xLabel();
        };
        GLinesSwapper.prototype.xDomain = function () {
            return this.provider.xDomain();
        };
        GLinesSwapper.prototype.xScale = function (domain) {
            return this.provider.xScale(domain);
        };
        GLinesSwapper.prototype.data = function (index) {
            return this.provider.data(this.original(index));
        };
        GLinesSwapper.prototype.translateEvent = function (event) {
            var ret = _super.prototype.translateEvent.call(this, event);
            ret.xDomainChanged = event.xDomainChanged;
            return ret;
        };
        return GLinesSwapper;
    }(GMatrixSwapper));
    exports.GLinesSwapper = GLinesSwapper;
    var GVariableLinesSwapper = (function (_super) {
        __extends(GVariableLinesSwapper, _super);
        function GVariableLinesSwapper(provider, newOrder) {
            _super.call(this, provider, newOrder);
        }
        GVariableLinesSwapper.prototype.setXDomain = function (domain) {
            this.provider.setXDomain(domain);
        };
        GVariableLinesSwapper.prototype.getXDomain = function () {
            return this.provider.getXDomain();
        };
        GVariableLinesSwapper.prototype.getFixedProvider = function () {
            var p = this.provider.getFixedProvider();
            return new GLinesSwapper(p, this.newOrder);
        };
        return GVariableLinesSwapper;
    }(GLinesSwapper));
    exports.GVariableLinesSwapper = GVariableLinesSwapper;
    var OneItemDimension = (function () {
        function OneItemDimension() {
            this._color = d3.scale.category20().domain(d3.range(1));
        }
        OneItemDimension.prototype.name = function () {
            return "";
        };
        OneItemDimension.prototype.size = function () {
            return 1;
        };
        OneItemDimension.prototype.items = function () {
            return [0];
        };
        OneItemDimension.prototype.key = function () {
            return null;
        };
        OneItemDimension.prototype.label = function (item, index) {
            return "";
        };
        OneItemDimension.prototype.color = function (index) {
            return this._color(index);
        };
        OneItemDimension.prototype.variableUnit = function () {
            return false;
        };
        OneItemDimension.prototype.on = function (type, listener) {
            return null;
        };
        return OneItemDimension;
    }());
});

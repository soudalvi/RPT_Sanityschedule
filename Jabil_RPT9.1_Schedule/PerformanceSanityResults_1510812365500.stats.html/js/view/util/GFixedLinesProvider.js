define(["require", "exports"], function (require, exports) {
    "use strict";
    var GFixedLinesProvider = (function () {
        function GFixedLinesProvider(original) {
            this.original = original;
        }
        GFixedLinesProvider.prototype.on = function (type, listener) {
            return this.original.on("changed", function (event) {
                if (!event.variableDomainChanged)
                    listener(event);
            });
        };
        GFixedLinesProvider.prototype.dataValue = function (data) {
            return this.original.dataValue(data);
        };
        GFixedLinesProvider.prototype.dataText = function (data, index) {
            return this.original.dataText(data, index);
        };
        GFixedLinesProvider.prototype.dataDomain = function (unitIndex, indices) {
            var unit = this.original.units[unitIndex];
            return this.original._data.domain(unit, indices);
        };
        GFixedLinesProvider.prototype.setXDomain = function (domain) {
            throw "Unsupported";
        };
        GFixedLinesProvider.prototype.getFixedProvider = function () {
            throw "Unsupported";
        };
        GFixedLinesProvider.prototype.unitCount = function () {
            return this.original.unitCount();
        };
        GFixedLinesProvider.prototype.unitLabel = function (unitIndex) {
            return this.original.unitLabel(unitIndex);
        };
        GFixedLinesProvider.prototype.unitScale = function (unitIndex, domain) {
            return this.original.unitScale(unitIndex, domain);
        };
        GFixedLinesProvider.prototype.unitDomain = function (unitIndex) {
            var unit = this.original.units[unitIndex];
            return this.original._data.domain(unit);
        };
        GFixedLinesProvider.prototype.xLabel = function () {
            return this.original.xLabel();
        };
        GFixedLinesProvider.prototype.xDomain = function () {
            return this.original._data.timeDomain();
        };
        GFixedLinesProvider.prototype.xScale = function (domain) {
            return this.original.xScale(domain);
        };
        GFixedLinesProvider.prototype.dimensionsCount = function () {
            return this.original.dimensionsCount();
        };
        GFixedLinesProvider.prototype.dimension = function (index) {
            return this.original.dimension(index);
        };
        GFixedLinesProvider.prototype.variableUnit = function (index) {
            return this.original.variableUnit(index);
        };
        GFixedLinesProvider.prototype.dataUnit = function (index) {
            return this.original.dataUnit(index);
        };
        GFixedLinesProvider.prototype.dataUnits = function (indices) {
            return this.original.dataUnits(indices);
        };
        GFixedLinesProvider.prototype.data = function (index) {
            return this.original._data.values(index);
        };
        GFixedLinesProvider.prototype.getActions = function (index) {
            return this.original.getActions(index);
        };
        return GFixedLinesProvider;
    }());
    exports.GFixedLinesProvider = GFixedLinesProvider;
});

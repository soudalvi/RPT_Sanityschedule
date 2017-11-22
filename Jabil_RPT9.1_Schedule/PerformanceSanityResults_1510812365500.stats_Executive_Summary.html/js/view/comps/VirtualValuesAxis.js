define(["require", "exports", "view/util/Margin"], function (require, exports, Margin) {
    "use strict";
    var VirtualValuesAxis = (function () {
        function VirtualValuesAxis(provider, horizontal, monitoring) {
            var _this = this;
            this.provider = provider;
            this.scales = this.createScales();
            if (monitoring)
                this.provider.on("changed", function (event) { return _this.processChange(event); });
            this.computeRange = horizontal ? this.horizontalRange : this.verticalRange;
        }
        VirtualValuesAxis.prototype.computeMargin = function () {
            return new Margin(0, 0, 0, 0);
        };
        VirtualValuesAxis.prototype.horizontalRange = function () {
            return [0, this.renderSize[0]];
        };
        VirtualValuesAxis.prototype.verticalRange = function () {
            return [this.renderSize[1], 0];
        };
        VirtualValuesAxis.prototype.createScale = function () {
            return d3.scale.linear();
        };
        VirtualValuesAxis.prototype.createScales = function () {
            var size = this.provider.unitCount();
            var scales = new Array(size);
            for (var i = 0; i < size; i++) {
                scales[i] = this.createScale()
                    .domain(this.provider.unitDomain(i));
            }
            return scales;
        };
        VirtualValuesAxis.prototype.updateRange = function () {
            var range = this.computeRange();
            var size = this.scales.length;
            for (var i = 0; i < size; i++) {
                this.scales[i].range(range);
            }
        };
        VirtualValuesAxis.prototype.setSize = function (width, height, animate) {
            this.renderSize = [width, height];
            this.updateRange();
        };
        VirtualValuesAxis.prototype.processChange = function (event) {
            var marginChanged = false;
            if (event.unitsChanged) {
                if (this.unitsChanged(event))
                    marginChanged = true;
            }
            else if (event.domainChanged) {
                this.domainChanged(event.majorChange);
            }
            return marginChanged;
        };
        VirtualValuesAxis.prototype.domainChanged = function (majorChange) {
            var size = this.scales.length;
            for (var i = 0; i < size; i++) {
                this.scales[i].domain(this.provider.unitDomain(i));
            }
        };
        VirtualValuesAxis.prototype.unitsChanged = function (event) {
            this.scales = this.createScales();
            if (this.renderSize) {
                this.updateRange();
            }
            return false;
        };
        return VirtualValuesAxis;
    }());
    return VirtualValuesAxis;
});

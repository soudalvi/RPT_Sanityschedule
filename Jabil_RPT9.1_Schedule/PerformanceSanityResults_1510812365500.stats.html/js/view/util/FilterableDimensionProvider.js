var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "view/util/ItemFilter", "view/util/OrnamentProviders"], function (require, exports, Evented, ItemFilter_1, OrnamentProviders_1) {
    "use strict";
    var FilterableDimensionProvider = (function (_super) {
        __extends(FilterableDimensionProvider, _super);
        function FilterableDimensionProvider(provider, dimension) {
            _super.call(this);
            this.provider = provider.dimension(dimension);
            this.filter = new ItemFilter_1.ItemFilter(this.provider.size());
        }
        FilterableDimensionProvider.prototype.source = function () {
            return this.provider;
        };
        FilterableDimensionProvider.prototype.name = function () {
            return this.provider.name();
        };
        FilterableDimensionProvider.prototype.size = function () {
            return this.filter.size();
        };
        FilterableDimensionProvider.prototype.items = function () {
            return this.filter.apply(this.provider.items());
        };
        FilterableDimensionProvider.prototype.key = function () {
            var f = this.provider.key();
            if (f)
                return function (item) { return f(item.object); };
            return function (item) { return item.index.toString(); };
        };
        FilterableDimensionProvider.prototype.label = function (item, index) {
            return this.provider.label(item.object, item.index);
        };
        FilterableDimensionProvider.prototype.isItemSelected = function (index) {
            return this.filter.contains(index);
        };
        FilterableDimensionProvider.prototype.isAllItemsSelected = function () {
            return this.filter.isFull();
        };
        FilterableDimensionProvider.prototype.selectItem = function (index, selected) {
            if (selected)
                this.filter.add(index);
            else
                this.filter.remove(index);
            this.emit("changed", {
                selectionChanged: true
            });
            this.emit("legendSelectionChanged", {});
        };
        FilterableDimensionProvider.prototype.selectItems = function (indices) {
            this.filter.setSelected(indices);
            this.emit("changed", {
                selectionChanged: true
            });
            this.emit("legendSelectionChanged", {});
        };
        FilterableDimensionProvider.prototype.sourceIndex = function (index) {
            return this.filter.index(index);
        };
        FilterableDimensionProvider.prototype.legendItemIndices = function (indices) {
            return this.filter.unfilteredIndices(indices);
        };
        FilterableDimensionProvider.prototype.itemsChanged = function () {
            this.filter = new ItemFilter_1.ItemFilter(this.provider.size());
            this.emit("changed", {
                sourceItemsChanged: true,
                selectionChanged: true
            });
        };
        FilterableDimensionProvider.prototype.ornament = function (ornament) {
            var _this = this;
            if (OrnamentProviders_1.isColorProvider(ornament))
                return {
                    color: function (index) {
                        return ornament.color(_this.filter.index(index));
                    }
                };
            if (OrnamentProviders_1.isStrokeProvider(ornament))
                return {
                    stroke: function (index) {
                        return ornament.stroke(_this.filter.index(index));
                    }
                };
            if (OrnamentProviders_1.isShadeProvider(ornament))
                return {
                    shade: function (color, index) {
                        return ornament.shade(color, _this.filter.index(index));
                    }
                };
            return null;
        };
        return FilterableDimensionProvider;
    }(Evented));
    exports.FilterableDimensionProvider = FilterableDimensionProvider;
});

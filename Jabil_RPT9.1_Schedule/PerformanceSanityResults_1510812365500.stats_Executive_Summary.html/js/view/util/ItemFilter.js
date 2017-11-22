define(["require", "exports", "view/query/queryUtil"], function (require, exports, qu) {
    "use strict";
    var ItemFilter = (function () {
        function ItemFilter(size) {
            this.originalSize = size;
            this.map = undefined;
        }
        ItemFilter.prototype.isFull = function () {
            return this.map === undefined;
        };
        ItemFilter.prototype.isEmpty = function () {
            return this.map && this.map.length == 0;
        };
        ItemFilter.prototype.remove = function (index) {
            if (!this.map) {
                var size = this.originalSize - 1;
                this.map = new Array(size);
                var val = 0;
                for (var i = 0; i < size; i++) {
                    if (i == index)
                        val++;
                    this.map[i] = val++;
                }
            }
            else {
                var size = this.map.length;
                for (var i = 0; i < size; i++) {
                    if (this.map[i] == index) {
                        this.map.splice(i, 1);
                        break;
                    }
                }
            }
        };
        ItemFilter.prototype.add = function (index) {
            var size = this.map.length;
            if (size == this.originalSize - 1) {
                this.map = undefined;
            }
            else {
                for (var i = 0; i < size; i++) {
                    if (this.map[i] > index) {
                        this.map.splice(i, 0, index);
                        return;
                    }
                }
                this.map.push(index);
            }
        };
        ItemFilter.prototype.addAll = function () {
            this.map = undefined;
        };
        ItemFilter.prototype.removeAll = function () {
            this.map = [];
        };
        ItemFilter.prototype.setSelected = function (indices) {
            this.map = indices;
        };
        ItemFilter.prototype.updateSelected = function (indices) {
            if (this.map === undefined) {
                if (indices === undefined || indices.length == this.originalSize)
                    return false;
            }
            else if (indices !== undefined) {
                if (qu.arrayEquals(this.map, indices))
                    return false;
            }
            this.setSelected(indices);
            return true;
        };
        ItemFilter.prototype.contains = function (index) {
            if (this.map)
                return this.map.indexOf(index) != -1;
            return true;
        };
        ItemFilter.prototype.filteredIndex = function (index) {
            if (this.map)
                return this.map.indexOf(index);
            return index;
        };
        ItemFilter.prototype.filteredIndices = function (indices) {
            var _this = this;
            if (indices === undefined)
                return undefined;
            if (this.map)
                return indices.map(function (i) { return _this.map.indexOf(i); }).filter(function (i) { return i != -1; });
            return indices;
        };
        ItemFilter.prototype.index = function (index) {
            if (this.map) {
                return this.map[index];
            }
            return index;
        };
        ItemFilter.prototype.apply = function (objects) {
            if (this.map) {
                var size = this.map.length;
                var ret = new Array(size);
                for (var i = 0; i < size; i++) {
                    var idx = this.map[i];
                    ret[i] = { index: idx, object: objects[idx] };
                }
                return ret;
            }
            else {
                var size = this.originalSize;
                var ret = new Array(size);
                for (var i = 0; i < size; i++) {
                    ret[i] = { index: i, object: objects[i] };
                }
                return ret;
            }
        };
        ItemFilter.prototype.applyOne = function (index, accessor) {
            var idx = this.map ? this.map[index] : index;
            return { index: idx, object: accessor(idx) };
        };
        ItemFilter.prototype.size = function () {
            if (this.map) {
                return this.map.length;
            }
            return this.originalSize;
        };
        ItemFilter.prototype.unfilteredIndices = function (indices) {
            if (indices === undefined)
                return this.map;
            if (this.map === undefined)
                return indices;
            return this.map.filter(function (v) { return indices.indexOf(v) != -1; });
        };
        return ItemFilter;
    }());
    exports.ItemFilter = ItemFilter;
});

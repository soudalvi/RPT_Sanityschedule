define(["require", "exports"], function (require, exports) {
    "use strict";
    function reorderMap(before, after) {
        var newLength = after.length;
        var ret = new Array(newLength);
        for (var i = 0; i < newLength; i++) {
            ret[i] = before.indexOf(after[i]);
        }
        return ret;
    }
    var Reordering = (function () {
        function Reordering(before, after) {
            this.oldPositions = reorderMap(before, after);
        }
        Reordering.prototype.hasChanges = function () {
            var size = this.oldPositions.length;
            for (var i = 0; i < size; i++) {
                if (this.oldPositions[i] != i)
                    return true;
            }
            return false;
        };
        Reordering.prototype.hasAddedElements = function () {
            var size = this.oldPositions.length;
            for (var i = 0; i < size; i++) {
                if (this.oldPositions[i] == -1)
                    return true;
            }
            return false;
        };
        Reordering.prototype.apply = function (array, defValue) {
            var size = this.oldPositions.length;
            var reordered = new Array(size);
            for (var i = 0; i < size; i++) {
                var oldpos = this.oldPositions[i];
                if (oldpos == -1) {
                    reordered[i] = defValue;
                }
                else {
                    reordered[i] = array[oldpos];
                }
            }
            return reordered;
        };
        Reordering.prototype.applyDeep = function (array, depth, defValue) {
            if (depth == 0)
                return this.apply(array, defValue);
            for (var i = 0; i < array.length; i++) {
                var a = array[i];
                if (a === undefined)
                    continue;
                array[i] = this.applyDeep(a, depth - 1, defValue);
            }
            return array;
        };
        return Reordering;
    }());
    return Reordering;
});

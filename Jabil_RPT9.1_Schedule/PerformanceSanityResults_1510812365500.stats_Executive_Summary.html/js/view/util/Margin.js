define(["require", "exports"], function (require, exports) {
    "use strict";
    var Margin = (function () {
        function Margin(top, right, bottom, left) {
            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.left = left;
        }
        Margin.prototype.add = function (margin) {
            return new Margin(margin.top + this.top, margin.right + this.right, margin.bottom + this.bottom, margin.left + this.left);
        };
        Margin.prototype.netWidth = function (width) {
            return width - this.left - this.right;
        };
        Margin.prototype.netHeight = function (height) {
            return height - this.top - this.bottom;
        };
        return Margin;
    }());
    return Margin;
});

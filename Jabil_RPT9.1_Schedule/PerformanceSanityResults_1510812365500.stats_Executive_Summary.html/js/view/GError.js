define(["require", "exports"], function (require, exports) {
    "use strict";
    var GError = (function () {
        function GError(message) {
            this.message = message;
            this.size = [0, 0];
        }
        GError.prototype.resize = function (w, h) {
            return this.size = [w, h];
        };
        GError.prototype.renderLegend = function (parentDiv) {
        };
        GError.prototype.renderContents = function (parentDiv, w, h) {
            parentDiv.append("p").text(this.message);
            return [w, h];
        };
        GError.prototype.on = function (type, listener) {
            return { remove: function () { } };
        };
        return GError;
    }());
    return GError;
});

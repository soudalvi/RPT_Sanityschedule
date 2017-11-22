define(["require", "exports"], function (require, exports) {
    "use strict";
    var Dimension = (function () {
        function Dimension() {
        }
        Dimension.prototype.variableUnit = function () {
            return false;
        };
        Dimension.prototype.setSession = function (session) { };
        Dimension.prototype.dispose = function () { };
        return Dimension;
    }());
    exports.Dimension = Dimension;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/CountersDimension", "view/query/GQueryProvider"], function (require, exports, CountersDimension, GQueryProvider_1) {
    "use strict";
    var GMatrixQueryProvider = (function (_super) {
        __extends(GMatrixQueryProvider, _super);
        function GMatrixQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
        }
        GMatrixQueryProvider.prototype.dispose = function () {
            for (var _i = 0, _a = this.dimensions; _i < _a.length; _i++) {
                var d = _a[_i];
                d.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        GMatrixQueryProvider.prototype.setSession = function (session) {
            for (var _i = 0, _a = this.dimensions; _i < _a.length; _i++) {
                var d = _a[_i];
                d.setSession(session);
            }
            _super.prototype.setSession.call(this, session);
        };
        GMatrixQueryProvider.prototype.dimension = function (dim) {
            return this.dimensions[dim];
        };
        GMatrixQueryProvider.prototype.variableUnit = function (dim) {
            return this.dimensions[dim].variableUnit();
        };
        GMatrixQueryProvider.prototype.dimensionsCount = function () {
            return this.dimensions.length;
        };
        GMatrixQueryProvider.prototype.createCountersDimension = function () {
            return new CountersDimension(this);
        };
        return GMatrixQueryProvider;
    }(GQueryProvider_1.GQueryProvider));
    return GMatrixQueryProvider;
});

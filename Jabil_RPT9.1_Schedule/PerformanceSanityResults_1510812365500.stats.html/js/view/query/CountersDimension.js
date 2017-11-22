var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Dimension", "jrptlib/Properties!APPMSG"], function (require, exports, Dimension_1, APPMSG) {
    "use strict";
    var CountersDimension = (function (_super) {
        __extends(CountersDimension, _super);
        function CountersDimension(owner) {
            _super.call(this);
            this.owner = owner;
        }
        CountersDimension.prototype.name = function () {
            return APPMSG.DimCounters;
        };
        CountersDimension.prototype.size = function () {
            return this.owner.counterQueries.length;
        };
        CountersDimension.prototype.items = function () {
            return this.owner.counterQueries;
        };
        CountersDimension.prototype.key = function () {
            return function (counterQuery) {
                return counterQuery.path();
            };
        };
        CountersDimension.prototype.label = function (item, index) {
            return item.label(this.owner.counterLabelOptions);
        };
        CountersDimension.prototype.variableUnit = function () {
            return true;
        };
        return CountersDimension;
    }(Dimension_1.Dimension));
    return CountersDimension;
});

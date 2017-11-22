var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "view/query/queryUtil"], function (require, exports, Evented, qu) {
    "use strict";
    var GConsolidatedUnitProvider = (function (_super) {
        __extends(GConsolidatedUnitProvider, _super);
        function GConsolidatedUnitProvider(provider, consolidatedDim) {
            var _this = this;
            _super.call(this);
            this.provider = provider;
            this.consolidatedDim = consolidatedDim;
            this.filter = qu.sameElementArray(provider.dimensionsCount(), undefined);
            provider.on("changed", function (event) {
                _this.emit("changed", event);
            });
        }
        GConsolidatedUnitProvider.prototype.unitCount = function () {
            return this.provider.unitCount();
        };
        GConsolidatedUnitProvider.prototype.unitLabel = function (unitIndex) {
            return this.provider.unitLabel(unitIndex);
        };
        GConsolidatedUnitProvider.prototype.unitDomain = function (unitIndex) {
            return this.provider.dataConsolidatedDomain(unitIndex, this.filter, this.consolidatedDim);
        };
        GConsolidatedUnitProvider.prototype.unitScale = function (unitIndex, domain) {
            return this.provider.unitScale(unitIndex, domain);
        };
        return GConsolidatedUnitProvider;
    }(Evented));
    exports.GConsolidatedUnitProvider = GConsolidatedUnitProvider;
});

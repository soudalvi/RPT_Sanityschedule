var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GTabularQueryProvider"], function (require, exports, GTabularQueryProvider_1) {
    "use strict";
    var GLastQueryProvider = (function (_super) {
        __extends(GLastQueryProvider, _super);
        function GLastQueryProvider(counterQuerySet, bounds) {
            _super.call(this, counterQuerySet);
            this.bounds = bounds;
        }
        GLastQueryProvider.prototype.getRequestUrl = function () {
            var url = this.getSessionFullPath() + "/qlast?";
            url += this.counterQuerySet.getUrlParameter();
            if (this.bounds) {
                url += "&cumulativeFrom=" + this.bounds[0];
                if (this.bounds[1]) {
                    url += "&index=" + this.bounds[1];
                }
            }
            return url;
        };
        return GLastQueryProvider;
    }(GTabularQueryProvider_1.GTabularQueryProvider));
    exports.GLastQueryProvider = GLastQueryProvider;
});

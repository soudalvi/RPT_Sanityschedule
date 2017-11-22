var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GTabularQueryProvider", "view/query/TimeRangesDimension"], function (require, exports, GTabularQueryProvider_1, TimeRangesDimension) {
    "use strict";
    var GRangeQueryProvider = (function (_super) {
        __extends(GRangeQueryProvider, _super);
        function GRangeQueryProvider(counterQuerySet) {
            _super.call(this, counterQuerySet);
            this.timeRanges = new TimeRangesDimension();
        }
        GRangeQueryProvider.prototype.getRequestUrl = function () {
            var url = this.getSessionFullPath() + "/qranges?" + this.counterQuerySet.getUrlParameter();
            url += "&ranges=" + this.session.getSelectedTimeRangeIndices().join(",");
            url += this.session.hostsRoot.getEnabledHostsQuery();
            return url;
        };
        return GRangeQueryProvider;
    }(GTabularQueryProvider_1.GTabularQueryProvider));
    exports.GRangeQueryProvider = GRangeQueryProvider;
});

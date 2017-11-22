var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GTabularQueryProvider", "view/query/SessionsDimension"], function (require, exports, GTabularQueryProvider_1, SessionsDimension) {
    "use strict";
    var GCompareLastQueryProvider = (function (_super) {
        __extends(GCompareLastQueryProvider, _super);
        function GCompareLastQueryProvider(counterQuerySet, sessions, bounds) {
            _super.call(this, counterQuerySet);
            this.sessions = new SessionsDimension(sessions);
            this.bounds = bounds;
        }
        GCompareLastQueryProvider.prototype._computeUrl = function (sessionPath) {
            var url = sessionPath + "/qlast?" + this.counterQuerySet.getUrlParameter();
            if (this.bounds) {
                url += "&cumulativeFrom=" + this.bounds[0];
                if (this.bounds[1]) {
                    url += "&index=" + this.bounds[1];
                }
            }
            return url;
        };
        GCompareLastQueryProvider.prototype.getRequestUrl = function () {
            var requests = [];
            requests.push(this._computeUrl(this.getSessionFullPath()));
            var sessions = this.session.getSelectedSessions();
            for (var _i = 0, sessions_1 = sessions; _i < sessions_1.length; _i++) {
                var session = sessions_1[_i];
                requests.push(this._computeUrl(session.getBaseRequestUrl()));
            }
            return requests;
        };
        return GCompareLastQueryProvider;
    }(GTabularQueryProvider_1.GTabularQueryProvider));
    exports.GCompareLastQueryProvider = GCompareLastQueryProvider;
});

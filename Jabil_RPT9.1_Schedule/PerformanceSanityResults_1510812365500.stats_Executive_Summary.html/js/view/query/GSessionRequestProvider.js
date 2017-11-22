var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/query/GRequestProvider"], function (require, exports, GRequestProvider) {
    "use strict";
    var GSessionRequestProvider = (function (_super) {
        __extends(GSessionRequestProvider, _super);
        function GSessionRequestProvider() {
            _super.apply(this, arguments);
        }
        GSessionRequestProvider.prototype.setSession = function (session) {
            this.session = session;
            this.update(false);
        };
        GSessionRequestProvider.prototype.dispose = function () {
        };
        GSessionRequestProvider.prototype.update = function (notify) {
            if (this.session && this.session != null) {
                _super.prototype.update.call(this, notify);
                return true;
            }
            return false;
        };
        GSessionRequestProvider.prototype.getSessionFullPath = function () {
            return this.session.getBaseRequestUrl();
        };
        return GSessionRequestProvider;
    }(GRequestProvider));
    return GSessionRequestProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Dimension", "ui/SessionLabelProvider", "jrptlib/Properties!APPMSG"], function (require, exports, Dimension_1, SessionLabelProvider, APPMSG) {
    "use strict";
    var SessionsDimension = (function (_super) {
        __extends(SessionsDimension, _super);
        function SessionsDimension(sessions) {
            _super.call(this);
            this.sessions = sessions;
        }
        SessionsDimension.prototype.name = function () {
            return APPMSG.DimSessions;
        };
        SessionsDimension.prototype.size = function () {
            return this.sessions.length;
        };
        SessionsDimension.prototype.items = function () {
            return this.sessions;
        };
        SessionsDimension.prototype.key = function () {
            return function (session) {
                return session.sessionPath;
            };
        };
        SessionsDimension.prototype.label = function (item, index) {
            return (new SessionLabelProvider()).getText(item);
        };
        return SessionsDimension;
    }(Dimension_1.Dimension));
    return SessionsDimension;
});

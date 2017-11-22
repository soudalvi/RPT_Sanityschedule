define(["require", "exports", "model/session/Session", "jrptlib/DateFormat", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, Session, DateFormat, NLS, APPMSG) {
    "use strict";
    var SessionLabelProvider = (function () {
        function SessionLabelProvider() {
        }
        SessionLabelProvider.prototype.getText = function (item) {
            if (item instanceof Session) {
                var d = new DateFormat(item.getDate());
                return NLS.bind(APPMSG.SessionLabelFormat, [item.getTestName(), d.toDateString()]);
            }
            else if (item.type === "Container") {
                return item.name;
            }
            else if (item.type === "Session") {
                var d = new DateFormat(item.date);
                return NLS.bind(APPMSG.SessionLabelFormat, [item.label, d.toDateString()]);
            }
            return "";
        };
        SessionLabelProvider.prototype.getDescription = function (item) {
            return null;
        };
        SessionLabelProvider.prototype.getIcon = function (item) {
            return null;
        };
        SessionLabelProvider.prototype.getCssClass = function (item) {
            if (item.type === "Container") {
                return "session-container";
            }
            else if (item.type === "Session") {
                return "session";
            }
            else
                return "";
        };
        return SessionLabelProvider;
    }());
    return SessionLabelProvider;
});

define(["require", "exports", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, NLS, APPMSG) {
    "use strict";
    var SessionContentProvider = (function () {
        function SessionContentProvider(currentSessionSet) {
            this.currentSessionSet = currentSessionSet;
        }
        SessionContentProvider.prototype.createElements = function (container, cpath) {
            var ret = [];
            for (var i = 0; i < container.children.length; i++) {
                ret.push({ name: container.children[i],
                    type: "Container",
                    path: cpath,
                    object: container,
                    model: container.children[i] });
            }
            for (var i = 0; i < container.sessions.length; i++) {
                var session = container.sessions[i];
                if (!this.alreadyLoaded(cpath + "/" + session.id)) {
                    ret.push({ name: session.id,
                        testName: session.testName,
                        label: session.label,
                        date: new Date(parseInt(session.startTime)),
                        type: "Session",
                        path: cpath,
                        object: container,
                        model: session });
                }
            }
            return ret;
        };
        SessionContentProvider.prototype.getElements = function (item, handler) {
            handler(this.createElements(item, ""));
        };
        SessionContentProvider.prototype.hasChildren = function (item, handler) {
            handler(item.type === "Container");
        };
        SessionContentProvider.prototype.getChildren = function (item, handler) {
            if (item.type === "Container") {
                var url = "/analytics/sessions";
                var npath = item.path + "/" + encodeURIComponent(item.name);
                url += npath;
                var content_p = this;
                $.getJSON(url, null).done(function (data) {
                    handler(content_p.createElements(data, npath));
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    _app.showErrorMessage(NLS.bind(APPMSG.Unable_Retrieve_Sessions, errorThrown));
                });
            }
        };
        SessionContentProvider.prototype.alreadyLoaded = function (sessionPath) {
            if (!this.currentSessionSet)
                return false;
            var path = this.currentSessionSet.primarySession.sessionPath;
            if (path === sessionPath) {
                return true;
            }
            for (var i = 0; i < this.currentSessionSet.sessions.length; i++) {
                path = this.currentSessionSet.sessions[i].sessionPath;
                if (path === sessionPath) {
                    return true;
                }
            }
            return false;
        };
        return SessionContentProvider;
    }());
    exports.SessionContentProvider = SessionContentProvider;
});

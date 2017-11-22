var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "view/util/Dimension"], function (require, exports, Dimension_1) {
    "use strict";
    var AgentsDimension = (function (_super) {
        __extends(AgentsDimension, _super);
        function AgentsDimension(notifier, dim) {
            _super.call(this);
            this.notifier = notifier;
            this.dim = dim;
            this.agents = [];
        }
        AgentsDimension.prototype.dispose = function () {
            this.disposeSessionHandlers();
        };
        AgentsDimension.prototype.disposeSessionHandlers = function () {
            if (this.sessionEventHandlers) {
                for (var _i = 0, _a = this.sessionEventHandlers; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h.remove();
                }
                this.sessionEventHandlers = null;
            }
        };
        AgentsDimension.prototype.updateInput = function (session) {
            this.agents = session.hostsRoot.getGroups();
            var dimChanged = [];
            dimChanged[this.dim] = true;
            this.notifier.changed({
                majorChange: true,
                dimensionsChanged: dimChanged
            });
        };
        AgentsDimension.prototype.setSession = function (session) {
            var _this = this;
            this.disposeSessionHandlers();
            this.updateInput(session);
            this.sessionEventHandlers = [
                session.on("hosts", function (details) { return _this.hostsChanged(details, session); })
            ];
        };
        AgentsDimension.prototype.hostsChanged = function (details, session) {
            if (details.groupsChanged) {
                this.updateInput(session);
            }
        };
        AgentsDimension.prototype.getUrlParameters = function () {
            var url = "";
            for (var _i = 0, _a = this.agents; _i < _a.length; _i++) {
                var i = _a[_i];
                url += "&hostgroup=" + i.getHostQuery();
            }
            if (this.agents.length == 1) {
                url += "&hostgroup=";
            }
            return url;
        };
        AgentsDimension.prototype.name = function () {
            return "Agents";
        };
        AgentsDimension.prototype.size = function () {
            return this.agents.length;
        };
        AgentsDimension.prototype.items = function () {
            return this.agents;
        };
        AgentsDimension.prototype.key = function () {
            return function (datum) { return datum.getName(); };
        };
        AgentsDimension.prototype.label = function (item, index) {
            return item.getName();
        };
        return AgentsDimension;
    }(Dimension_1.Dimension));
    exports.AgentsDimension = AgentsDimension;
});

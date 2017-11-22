define(["require", "exports", "model/session/Agent"], function (require, exports, Agent) {
    "use strict";
    var Host = (function () {
        function Host(owner, name) {
            this.owner = owner;
            this.name = name;
            this.tags = {};
            this.enabled = true;
        }
        Host.prototype._update = function (host, categories) {
            for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                var cat = categories_1[_i];
                var tag = host.tags[cat.getId()];
                this.tags[cat.getId()] = cat.addValue(tag);
            }
            this.address = host.tags["address"];
            this.agents = [];
            for (var _a = 0, _b = host.agents; _a < _b.length; _a++) {
                var a = _b[_a];
                this.agents.push(new Agent(a, this));
            }
        };
        Host.prototype._updateSettings = function (filter) {
            this.enabled = filter == null || filter.indexOf(this.name) != -1;
        };
        Host.prototype.getName = function () {
            return this.name;
        };
        Host.prototype.getAgents = function () {
            return this.agents;
        };
        Host.prototype.getTags = function (categories) {
            var ret = [];
            for (var _i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
                var c = categories_2[_i];
                ret.push(this.tags[c]);
            }
            return ret;
        };
        Host.prototype.getHostQuery = function () {
            return this.name;
        };
        Host.prototype.isEnabled = function () {
            return this.enabled;
        };
        Host.prototype.setEnabled = function (enabled) {
            this.enabled = enabled;
            this.owner._applyHostsEnablement();
        };
        Host.prototype.getAddress = function () {
            return this.address;
        };
        return Host;
    }());
    return Host;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    var Agent = (function () {
        function Agent(agent, parent) {
            this.type = agent.type;
            this.name = agent.name;
            this.parent = parent;
        }
        Agent.prototype.getName = function () {
            return this.name;
        };
        Agent.prototype.getType = function () {
            return this.type;
        };
        Agent.prototype.getParent = function () {
            return this.parent;
        };
        return Agent;
    }());
    return Agent;
});

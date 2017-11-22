define(["require", "exports"], function (require, exports) {
    "use strict";
    var HostGroup = (function () {
        function HostGroup(name, hosts) {
            this.name = name;
            this.hosts = hosts;
        }
        HostGroup.prototype.getHosts = function () {
            return this.hosts;
        };
        HostGroup.prototype.getName = function () {
            return this.name;
        };
        HostGroup.prototype.getHostQuery = function () {
            return this.hosts.map(function (h) { return h.getName(); }).join(",");
        };
        return HostGroup;
    }());
    return HostGroup;
});

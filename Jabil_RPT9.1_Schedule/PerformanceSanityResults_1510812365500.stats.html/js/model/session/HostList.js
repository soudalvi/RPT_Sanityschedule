define(["require", "exports", "model/session/Host", "model/session/HostGroup", "model/session/HostCategory", "view/query/queryUtil"], function (require, exports, Host, HostGroup, HostCategory, queryUtil_1) {
    "use strict";
    var HostList = (function () {
        function HostList(session) {
            this.session = session;
            this.hosts = [];
            this.categories = [
                new HostCategory(this, "geo"),
                new HostCategory(this, "control")
            ];
            this.grouping = [];
            this.compare = false;
        }
        HostList.prototype.updateHosts = function (list) {
            var newHosts = this.hosts.slice();
            var oldCount = this.hosts.length;
            var added = 0;
            for (var _i = 0, _a = list.hosts; _i < _a.length; _i++) {
                var h = _a[_i];
                var host = this.findHost(h.name);
                if (!host) {
                    added++;
                    host = new Host(this, h.name);
                    newHosts.push(host);
                }
                host._update(h, this.categories);
            }
            this.hosts = newHosts;
            if (added > 0 || oldCount > newHosts.length) {
                this.groups = undefined;
                this.event({
                    hostsChanged: true,
                    groupsChanged: true
                });
            }
        };
        HostList.prototype.updateSettings = function (settings) {
            this.grouping = settings.hostGrouping;
            this.compare = settings.hostCompare;
            for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                var h = _a[_i];
                h._updateSettings(settings.hostFilter);
            }
            for (var _b = 0, _c = settings.categories; _b < _c.length; _b++) {
                var c = _c[_b];
                var cat = this.getCategory(c.id);
                if (cat) {
                    cat._updateSettings(c.filter);
                }
            }
        };
        HostList.prototype.findHost = function (name) {
            for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                var host = _a[_i];
                if (host.getName() == name)
                    return host;
            }
            return null;
        };
        HostList.prototype.getHosts = function () {
            return this.hosts;
        };
        HostList.prototype.getEnabledHosts = function () {
            return this.hosts.filter(function (h) { return h.isEnabled(); });
        };
        HostList.prototype.isAllHostsEnabled = function () {
            return this.hosts.every(function (h) { return h.isEnabled(); });
        };
        HostList.prototype.hasOneEnabledHost = function () {
            var ret = null;
            for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                var host = _a[_i];
                if (host.isEnabled()) {
                    if (ret == null)
                        ret = host;
                    else
                        return null;
                }
            }
            return ret;
        };
        HostList.prototype.enableAllHosts = function () {
            for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                var host = _a[_i];
                host._updateSettings(null);
            }
            this._applyHostsEnablement();
        };
        HostList.prototype._applyHostsEnablement = function () {
            if (this.grouping.length == 0) {
                this.groups = undefined;
                this.event({
                    groupsChanged: true
                });
            }
            var enabledHosts;
            if (this.isAllHostsEnabled()) {
                enabledHosts = null;
            }
            else {
                enabledHosts = [];
                for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                    var h = _a[_i];
                    if (h.isEnabled()) {
                        enabledHosts.push(h.getName());
                    }
                }
            }
            this.session.postUserSettings({
                hostFilter: enabledHosts
            });
        };
        HostList.prototype.isCompare = function () {
            return this.compare;
        };
        HostList.prototype.setCompare = function (compare) {
            this.compare = compare;
            this.event({
                compareChanged: true
            });
            this.session.postUserSettings({
                hostCompare: compare
            });
        };
        HostList.prototype.getGrouping = function () {
            return this.grouping;
        };
        HostList.prototype.setGrouping = function (grouping) {
            if (grouping === null || grouping === undefined)
                grouping = [];
            this.grouping = grouping;
            this.groups = undefined;
            this.event({
                groupsChanged: true
            });
            this.session.postUserSettings({
                hostGrouping: grouping
            });
        };
        HostList.prototype.getCategories = function () {
            return this.categories;
        };
        HostList.prototype.getCategory = function (id) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.getId() == id)
                    return c;
            }
            return null;
        };
        HostList.prototype.hasCategories = function () {
            return this.categories.some(function (c) { return c.hasValues(); });
        };
        HostList.prototype.isAllCategoryValuesEnabled = function () {
            return this.categories.every(function (c) { return c.isAllValuesEnabled(); });
        };
        HostList.prototype.enableAllValues = function (categories) {
            var changedCategories = [];
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var c = _a[_i];
                if (categories.indexOf(c.getId()) != -1) {
                    c._updateSettings(null);
                    changedCategories.push(c);
                }
            }
            this._applyCategoryValuesEnablement(changedCategories);
        };
        HostList.prototype._applyCategoryValuesEnablement = function (changedCategories) {
            var groupsAffected = false;
            for (var _i = 0, changedCategories_1 = changedCategories; _i < changedCategories_1.length; _i++) {
                var c = changedCategories_1[_i];
                if (this.grouping.indexOf(c.getId()) != -1) {
                    groupsAffected = true;
                    break;
                }
            }
            if (groupsAffected) {
                this.groups = undefined;
                this.event({
                    groupsChanged: true
                });
            }
            this.session.postUserSettings({
                categories: changedCategories.map(function (c) {
                    return {
                        id: c.getId(),
                        filter: c._getValueFilter()
                    };
                })
            });
        };
        HostList.prototype.getGroups = function () {
            if (this.groups === undefined) {
                this.groups = this.computeGroups();
            }
            return this.groups;
        };
        HostList.prototype.computeGroups = function () {
            if (this.grouping.length == 0) {
                return this.hosts.filter(function (h) { return h.isEnabled(); });
            }
            var tags = [];
            var hostGroups = [];
            for (var _i = 0, _a = this.hosts; _i < _a.length; _i++) {
                var h = _a[_i];
                var t = h.getTags(this.grouping);
                if (!t.every(function (v) { return v.isEnabled(); }))
                    continue;
                var i = queryUtil_1.arrayIndexOf(tags, t);
                var hostList = void 0;
                if (i == -1) {
                    tags.push(t);
                    hostList = [];
                    hostGroups.push(hostList);
                }
                else {
                    hostList = hostGroups[i];
                }
                hostList.push(h);
            }
            var ret = [];
            for (var i = 0; i < hostGroups.length; i++) {
                var name_1 = tags[i].map(function (t) { return t.getValue(); }).join(" - ");
                ret.push(new HostGroup(name_1, hostGroups[i]));
            }
            return ret;
        };
        HostList.prototype.getEnabledHostsQuery = function () {
            if (this.grouping.length == 0) {
                if (this.isAllHostsEnabled())
                    return "";
            }
            else {
                if (this.isAllCategoryValuesEnabled())
                    return "";
            }
            return "&hostgroup=" + this.getGroups().map(function (g) { return g.getHostQuery(); }).join(",");
        };
        HostList.prototype.event = function (details) {
            this.session.emit("hosts", details);
        };
        return HostList;
    }());
    return HostList;
});

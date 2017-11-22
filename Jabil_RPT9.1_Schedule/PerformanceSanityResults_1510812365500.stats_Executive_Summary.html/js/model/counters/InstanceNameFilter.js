define(["require", "exports", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, NLS, APPMSG) {
    "use strict";
    var InstanceNameFilter = (function () {
        function InstanceNameFilter() {
            this.showMatch = true;
            this.contains = true;
            this.caseSensitive = false;
            this.name = "";
        }
        InstanceNameFilter.prototype.getLabel = function () {
            if (this.showMatch) {
                if (this.contains) {
                    if (this.caseSensitive) {
                        return NLS.bind(APPMSG.InstanceNameFilter_include_contains_caseSensitive, this.name);
                    }
                    else {
                        return NLS.bind(APPMSG.InstanceNameFilter_include_contains_caseUnsensitive, this.name);
                    }
                }
                else {
                    if (this.caseSensitive) {
                        return NLS.bind(APPMSG.InstanceNameFilter_include_equals_caseSensitive, this.name);
                    }
                    else {
                        return NLS.bind(APPMSG.InstanceNameFilter_include_equals_caseUnsensitive, this.name);
                    }
                }
            }
            else {
                if (this.contains) {
                    if (this.caseSensitive) {
                        return NLS.bind(APPMSG.InstanceNameFilter_exclude_contains_caseSensitive, this.name);
                    }
                    else {
                        return NLS.bind(APPMSG.InstanceNameFilter_exclude_contains_caseUnsensitive, this.name);
                    }
                }
                else {
                    if (this.caseSensitive) {
                        return NLS.bind(APPMSG.InstanceNameFilter_exclude_equals_caseSensitive, this.name);
                    }
                    else {
                        return NLS.bind(APPMSG.InstanceNameFilter_exclude_equals_caseUnsensitive, this.name);
                    }
                }
            }
        };
        InstanceNameFilter.prototype.isValid = function () {
            return true;
        };
        InstanceNameFilter.prototype.saveToView = function (wildcardOptionsNode) {
            var node = $($.parseXML("<NameFilter/>").documentElement);
            node.appendTo($(wildcardOptionsNode));
            var namesNode = $($.parseXML("<names/>").documentElement);
            namesNode.appendTo(node);
            var names = this.name.split("||");
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_1 = names_1[_i];
                $($.parseXML("<item>" + name_1 + "</item>").documentElement).appendTo(namesNode);
            }
            if (this.showMatch)
                $(node).attr("showMatch", "true");
            if (this.contains)
                $(node).attr("contains", "true");
            if (this.caseSensitive)
                $(node).attr("caseSensitive", "true");
        };
        InstanceNameFilter.prototype.toJson = function () {
            return {
                type: "NameFilter",
                showMatch: this.showMatch,
                contains: this.contains,
                caseSensitive: this.caseSensitive,
                names: this.name.split("||")
            };
        };
        InstanceNameFilter.loadFromView = function (nameFilterNode) {
            var ret = new InstanceNameFilter();
            ret.showMatch = $(nameFilterNode).attr("showMatch") == "true";
            ret.contains = $(nameFilterNode).attr("contains") == "true";
            ret.caseSensitive = $(nameFilterNode).attr("caseSensitive") == "true";
            var name;
            $(nameFilterNode).children("names").children("item").each(function () {
                var n = $(this).text();
                if (name)
                    name += "||" + n;
                else
                    name = n;
            });
            ret.name = name;
            return ret;
        };
        InstanceNameFilter.exactMatch = function (name) {
            var ret = new InstanceNameFilter();
            ret.caseSensitive = true;
            ret.contains = false;
            ret.name = name;
            return ret;
        };
        return InstanceNameFilter;
    }());
    return InstanceNameFilter;
});

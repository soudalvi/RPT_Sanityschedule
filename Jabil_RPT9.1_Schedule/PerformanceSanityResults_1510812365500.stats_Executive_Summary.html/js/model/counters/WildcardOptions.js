var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "model/counters/InstanceCountFilter", "model/counters/InstanceValueFilter", "model/counters/InstanceNameFilter"], function (require, exports, Evented, InstanceCountFilter, InstanceValueFilter, InstanceNameFilter) {
    "use strict";
    function createFilter(filterNode) {
        switch (filterNode.nodeName) {
            case "CountFilterInfo":
                return InstanceCountFilter.loadFromView(filterNode);
            case "ValueFilterInfo":
                return InstanceValueFilter.loadFromView(filterNode);
            case "NameFilter":
                return InstanceNameFilter.loadFromView(filterNode);
            default:
                throw "Unknown filter type " + filterNode.nodeName;
        }
    }
    function path(node, name) {
        var children = $(node).children(name);
        if (children.attr("unresolved") == "true")
            return null;
        return children.attr("path");
    }
    var WildcardOptions = (function (_super) {
        __extends(WildcardOptions, _super);
        function WildcardOptions(wildcards, filters, cumulateFrom, index) {
            _super.call(this);
            this.wildcards = wildcards;
            this.filters = filters !== undefined ? filters : [];
            this.cumulateFrom = cumulateFrom;
            this.index = index;
        }
        WildcardOptions.prototype.reset = function () {
            this.isContainer = undefined;
            this.instance = undefined;
        };
        WildcardOptions.prototype.getPath = function () {
            return this.wildcards.join("/");
        };
        WildcardOptions.prototype.getLastSegment = function () {
            return this.wildcards[this.wildcards.length - 1];
        };
        WildcardOptions.prototype.getParentSegment = function () {
            if (this.wildcards.length == 1)
                return null;
            return this.wildcards.slice(0, this.wildcards.length - 1);
        };
        WildcardOptions.prototype.getLabel = function (counterProvider) {
            var desc = counterProvider.resolveWildcard(this.wildcards);
            if (desc)
                return desc.pluralLabel;
            return this.getPath();
        };
        WildcardOptions.prototype.add = function (instanceFilter) {
            this.filters.push(instanceFilter);
            this.emit("filtersChanged", {});
        };
        WildcardOptions.prototype.insertAfter = function (afterWhat, newInstanceFilter) {
            var index = this.filters.indexOf(afterWhat);
            if (index == -1)
                throw "afterWhat does not belong to filters list";
            this.filters.splice(index + 1, 0, newInstanceFilter);
            this.emit("filtersChanged", {});
        };
        WildcardOptions.prototype.move = function (dir, instanceFilter) {
            var index = this.filters.indexOf(instanceFilter);
            if (index == -1)
                throw "instanceFilter does not belong to filters list";
            ;
            if (index + dir >= 0 && index + dir < this.filters.length) {
                this.filters.splice(index, 1);
                this.filters.splice(index + dir, 0, instanceFilter);
            }
            this.emit("filtersChanged", {});
        };
        WildcardOptions.prototype.remove = function (instanceFilter) {
            var index = this.filters.indexOf(instanceFilter);
            this.filters.splice(index, 1);
            this.emit("filtersChanged", {});
        };
        WildcardOptions.prototype.replace = function (instanceFilterToReplace, newInstanceFilter) {
            var index = this.filters.indexOf(instanceFilterToReplace);
            if (index == -1)
                throw "instanceFilterToReplace does not belong to filters list";
            this.filters.splice(index, 1, newInstanceFilter);
            this.emit("filtersChanged", {});
        };
        WildcardOptions.prototype.isValid = function () {
            if (!this.filters)
                return true;
            for (var i = 0; i < this.filters.length; i++) {
                if (!this.filters[i].isValid()) {
                    return false;
                }
            }
            return true;
        };
        WildcardOptions.prototype.saveToView = function (parent) {
            var node = $.parseXML("<WildcardOptions/>").documentElement;
            $(node)
                .attr("wildcards", this.wildcards.join(','))
                .appendTo(parent);
            if (this.cumulateFrom) {
                var cumulateFrom = $.parseXML("<cumulateFrom/>").documentElement;
                $(cumulateFrom)
                    .attr("path", this.cumulateFrom)
                    .appendTo($(node));
            }
            if (this.index) {
                var index = $.parseXML("<index/>").documentElement;
                $(index)
                    .attr("path", this.index)
                    .appendTo($(node));
            }
            var filters = $.parseXML("<filters/>").documentElement;
            $(filters).appendTo($(node));
            if (this.filters && this.filters.length > 0) {
                for (var i = 0; i < this.filters.length; i++) {
                    var f = this.filters[i];
                    f.saveToView(filters);
                }
            }
            return node;
        };
        WildcardOptions.prototype.toJson = function () {
            if (this.filters.length == 0 && !this.cumulateFrom && !this.index)
                return null;
            var filters = [];
            for (var i = 0; i < this.filters.length; i++) {
                if (this.filters[i].isValid()) {
                    filters.push(this.filters[i].toJson());
                }
            }
            var ret = {
                wildcards: this.wildcards.join(","),
                filters: filters
            };
            if (this.cumulateFrom)
                ret.cumulateFrom = { path: this.cumulateFrom };
            if (this.index)
                ret.index = { path: this.index };
            return ret;
        };
        WildcardOptions.loadFromView = function (wildcardOptionsNode) {
            var wildcards = $(wildcardOptionsNode).attr("wildcards").split(",");
            var cumulateFrom = path(wildcardOptionsNode, "cumulateFrom");
            var index = path(wildcardOptionsNode, "index");
            var filters = [];
            $(wildcardOptionsNode).children("filters").children().each(function () {
                var f = createFilter(this);
                if (f)
                    filters.push(f);
            });
            return new WildcardOptions(wildcards, filters, cumulateFrom, index);
        };
        return WildcardOptions;
    }(Evented));
    return WildcardOptions;
});

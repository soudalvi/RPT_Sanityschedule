define(["require", "exports", "jrptlib/Nls", "jrptlib/Properties!APPMSG"], function (require, exports, NLS, APPMSG) {
    "use strict";
    function findDescriptor(name, descriptors) {
        for (var _i = 0, descriptors_1 = descriptors; _i < descriptors_1.length; _i++) {
            var d = descriptors_1[_i];
            if (d.id == name)
                return d;
        }
        return null;
    }
    var CounterContentProvider = (function () {
        function CounterContentProvider(session, ready) {
            this.session = session;
            this.request(ready);
        }
        CounterContentProvider.prototype.getCounters = function () {
            return this.counters;
        };
        CounterContentProvider.prototype.getWildcardRoot = function () {
            return this.wildcardRoot;
        };
        CounterContentProvider.prototype.resolveWildcard = function (segments) {
            var parent = this.wildcardRoot;
            for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
                var w = segments_1[_i];
                if (!parent || !parent.children)
                    return null;
                parent = findDescriptor(w, parent.children);
            }
            return parent;
        };
        CounterContentProvider.prototype.createElementsFromSilo = function (data, cpath) {
            if (data.counters) {
                this.counters = this.createCountersFromDesc(null, data.counters, cpath);
            }
            else {
                this.counters = [];
            }
            if (data.wildcards) {
                this.wildcardRoot = data.wildcards;
            }
        };
        CounterContentProvider.prototype.createCountersFromDesc = function (parent, data, cpath) {
            var ret = new Array();
            if (data.children) {
                for (var i = 0; i < data.children.length; i++) {
                    var d = data.children[i];
                    var obj = {
                        type: "counter",
                        path: cpath + "/" + d.id,
                        counter: d,
                        parent: parent };
                    if (!obj.counter.standaloneLabel) {
                        if (obj.counter.id.substr(0, 1) == "[") {
                            obj.counter.standaloneLabel = data.standaloneLabel;
                        }
                        else {
                            obj.counter.standaloneLabel = obj.counter.label;
                        }
                    }
                    ret.push(obj);
                    if (obj.counter.children) {
                        obj.children = this.createCountersFromDesc(obj, obj.counter, obj.path);
                    }
                }
            }
            return ret;
        };
        CounterContentProvider.prototype.request = function (handler) {
            var _this = this;
            var url = (this.session ? this.session.getBaseRequestUrl() : "/analytics")
                + "/descriptors/all";
            $.getJSON(url, null).done(function (data) {
                _this.createElementsFromSilo(data, "");
                handler();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _app.showErrorMessage(NLS.bind(APPMSG.UnableToRetrieveCounters, errorThrown));
            });
        };
        return CounterContentProvider;
    }());
    return CounterContentProvider;
});

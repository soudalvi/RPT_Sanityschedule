var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Form", "jrptlib/Url", "jrptlib/Properties!APPMSG", "jrptlib/Offline!"], function (require, exports, Evented, Form, Url, APPMSG, Offline) {
    "use strict";
    var InstancesSelector = (function (_super) {
        __extends(InstancesSelector, _super);
        function InstancesSelector(wildcards, allAllowed, pageId, parent) {
            _super.call(this);
            this.wildcards = wildcards;
            this.instances = {};
            this.form = $("<form>")
                .addClass("instances")
                .appendTo(parent);
            var page = this;
            for (var i = 0; i < wildcards.length; i++) {
                var index = i;
                var opt = $("<select>")
                    .appendTo(this.form)
                    .addClass("instance-selector")
                    .attr("id", "is" + pageId + "_" + i)
                    .change(function (event) {
                    var val = $(this).val();
                    if (val == "*")
                        val = undefined;
                    page.replaceInstance(index, val);
                });
                if (allAllowed) {
                    $("<option value='*'>").text(APPMSG.AllInstances).appendTo($(opt));
                    opt.val(0);
                }
            }
            new Form(this.form, null);
            $(".instance-selector").selectmenu("option", "width", "auto");
        }
        InstancesSelector.prototype.setSession = function (session) {
            this.session = session;
            if (session) {
                this.fillValues(0);
            }
            else {
                for (var i = 0; i < this.wildcards.length; i++) {
                    this.clearWildcardValues(i);
                }
            }
        };
        InstancesSelector.prototype.getInstances = function () {
            return this.instances;
        };
        InstancesSelector.prototype.setInstances = function (instances, skipSelectorUpdate) {
            this.instances = instances;
            this.emit("instancesChanged", {});
            if (!skipSelectorUpdate) {
                for (var i = 0; i < this.wildcards.length; i++) {
                    this.setSpecificInstance(i, instances[this.wildcards[i]]);
                }
            }
        };
        InstancesSelector.prototype.replaceInstance = function (windex, instance) {
            this.instances[this.wildcards[windex]] = instance;
            this.setInstances(this.instances, true);
            this.fillValues(windex + 1);
        };
        InstancesSelector.prototype.setSpecificInstance = function (windex, instance) {
            var select = this.form.find(".instance-selector").eq(windex);
            if (instance) {
                var option = select.children("option")
                    .filter(function (i, e) { return $(e).text() == instance; });
                if (option.length == 0) {
                    $("<option>" + instance + "</option>").appendTo(select);
                }
            }
            select.val(instance == undefined ? "*" : instance);
            select.selectmenu('refresh');
        };
        InstancesSelector.prototype.fillValues = function (from) {
            if (Offline.isActivated())
                return;
            for (var i = from; i < this.wildcards.length; i++) {
                this.clearWildcardValues(i);
                this.fillWildcardValues(i);
                if (this.instances[this.wildcards[i]] === undefined)
                    break;
            }
        };
        InstancesSelector.prototype.fillWildcardValues = function (windex) {
            var _this = this;
            var url = this.session.getBaseRequestUrl() + "/instances?";
            for (var i = 0; i <= windex; i++) {
                url += "&wildcard=" + this.wildcards[i];
            }
            for (var i = 0; i < windex; i++) {
                url += "&instance=" + this.instances[this.wildcards[i]];
            }
            var nurl = new Url(url);
            nurl.request_get({
                handleAs: "json",
                headers: { "Accept": "application/json" }
            }).then(function (data) {
                if (data.children)
                    _this.setList(windex, data.children);
            });
        };
        InstancesSelector.prototype.clearWildcardValues = function (windex) {
            var select = this.form.find(".instance-selector").eq(windex);
            var currentInstance = this.instances[this.wildcards[windex]];
            var option = select.children("option")
                .filter(function (i, e) { var v = $(e).text(); return v != "*" && v != currentInstance; });
        };
        InstancesSelector.prototype.setList = function (windex, values) {
            var select = this.form.find(".instance-selector").eq(windex);
            var _loop_1 = function(v) {
                option = select.children("option")
                    .filter(function (i, e) { return $(e).text() == v; });
                if (option.length == 0) {
                    $("<option>" + v + "</option>").appendTo(select);
                }
            };
            var option;
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var v = values_1[_i];
                _loop_1(v);
            }
        };
        return InstancesSelector;
    }(Evented));
    return InstancesSelector;
});

define(["require", "exports", "model/session/CategoryValue"], function (require, exports, CategoryValue) {
    "use strict";
    var HostCategory = (function () {
        function HostCategory(owner, id) {
            this.hasDefinedValues = false;
            this.owner = owner;
            this.id = id;
            this.values = {};
        }
        HostCategory.prototype.getId = function () {
            return this.id;
        };
        HostCategory.prototype.getValues = function () {
            var ret = [];
            for (var v in this.values) {
                ret.push(this.values[v]);
            }
            return ret;
        };
        HostCategory.prototype.addValue = function (value) {
            var key = value ? value : "!";
            if (value)
                this.hasDefinedValues = true;
            var v = this.values[key];
            if (v === undefined) {
                v = new CategoryValue(this, value);
                this.values[value] = v;
            }
            return v;
        };
        HostCategory.prototype.hasValues = function () {
            return this.hasDefinedValues;
        };
        HostCategory.prototype.isAllValuesEnabled = function () {
            for (var v in this.values) {
                if (!this.values[v].isEnabled())
                    return false;
            }
            return true;
        };
        HostCategory.prototype.hasOneEnabledValue = function () {
            var ret = null;
            for (var v in this.values) {
                var value = this.values[v];
                if (value.isEnabled()) {
                    if (ret == null)
                        ret = value;
                    else
                        return null;
                }
            }
            return ret;
        };
        HostCategory.prototype._updateSettings = function (filter) {
            for (var v in this.values) {
                this.values[v]._updateSettings(filter);
            }
        };
        HostCategory.prototype.applyValuesEnablement = function () {
            this.owner._applyCategoryValuesEnablement([this]);
        };
        HostCategory.prototype._getValueFilter = function () {
            var enabledValues;
            if (this.isAllValuesEnabled()) {
                enabledValues = null;
            }
            else {
                enabledValues = [];
                for (var v in this.values) {
                    if (this.values[v].isEnabled())
                        enabledValues.push(v);
                }
            }
            return enabledValues;
        };
        return HostCategory;
    }());
    return HostCategory;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "edit/FilterEdit", "ui/OptionProvider", "jrptlib/Properties!APPMSG"], function (require, exports, Form, FilterEdit, OptionProvider_1, APPMSG) {
    "use strict";
    var FilterByNameEdit = (function (_super) {
        __extends(FilterByNameEdit, _super);
        function FilterByNameEdit() {
            _super.call(this);
        }
        FilterByNameEdit.prototype.createContents = function (container) {
            var _this = this;
            var opt = new OptionProvider_1.ListOptionProvider();
            opt.addOption({
                type: "TEXT",
                id: "filterByName_name",
                label: APPMSG.FilterByNameEdit_name,
                value: function () { return _this.filter.name; },
                change: function (value) {
                    _this.filter.name = value;
                    _this._emitFieldChanged();
                }
            });
            opt.addOption({
                type: "BOOLEAN",
                id: "filterByName_cs",
                label: APPMSG.FilterByNameEdit_caseSensitive,
                value: function () { return _this.filter.name; },
                change: function (value) {
                    _this.filter.caseSensitive = value;
                    _this._emitFieldChanged();
                }
            });
            opt.addOption({
                type: "RADIO",
                id: "filterByName_ic",
                label: APPMSG.FilterByNameEdit_include_contains,
                name: "radiogrp",
                value: function () { return _this.filter.showMatch && _this.filter.contains ? true : false; },
                change: function (value) { if (value)
                    _this._radioChanged(true, true); }
            });
            opt.addOption({
                type: "RADIO",
                id: "filterByName_ie",
                label: APPMSG.FilterByNameEdit_include_equals,
                name: "radiogrp",
                value: function () { return _this.filter.showMatch && !_this.filter.contains ? true : false; },
                change: function (value) { if (value)
                    _this._radioChanged(true, false); }
            });
            opt.addOption({
                type: "RADIO",
                id: "filterByName_ec",
                label: APPMSG.FilterByNameEdit_exclude_contains,
                name: "radiogrp",
                value: function () { return !_this.filter.showMatch && _this.filter.contains ? true : false; },
                change: function (value) { if (value)
                    _this._radioChanged(false, true); }
            });
            opt.addOption({
                type: "RADIO",
                id: "filterByName_ee",
                label: APPMSG.FilterByNameEdit_exclude_equals,
                name: "radiogrp",
                value: function () { return !_this.filter.showMatch && !_this.filter.contains ? true : false; },
                change: function (value) { if (value)
                    _this._radioChanged(false, false); }
            });
            this.options = opt;
            var form = $("<form>").appendTo(container);
            var ul = $("<ul>").appendTo(form);
            opt.createWidgets(ul);
            new Form(form, null);
        };
        FilterByNameEdit.prototype._radioChanged = function (showMatch, contains) {
            var chg = this.showMatch != showMatch || this.contains != contains;
            if (chg) {
                this.filter.showMatch = showMatch;
                this.filter.contains = contains;
                this._emitFieldChanged();
            }
        };
        FilterByNameEdit.prototype.updateContents = function (filter) {
            this.filter = filter;
            this.showMatch = this.filter.showMatch;
            this.contains = this.filter.contains;
            this.options.update();
        };
        return FilterByNameEdit;
    }(FilterEdit));
    return FilterByNameEdit;
});

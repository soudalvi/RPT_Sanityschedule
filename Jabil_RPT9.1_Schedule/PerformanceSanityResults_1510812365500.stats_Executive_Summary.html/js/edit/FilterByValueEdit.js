var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "edit/FilterPrimaryCounterEdit", "ui/OptionProvider", "jrptlib/Properties!APPMSG"], function (require, exports, Form, FilterPrimaryCounterEdit, OptionProvider_1, APPMSG) {
    "use strict";
    var FilterByValueEdit = (function (_super) {
        __extends(FilterByValueEdit, _super);
        function FilterByValueEdit(counterDescTree, wildcards) {
            _super.call(this, counterDescTree, wildcards);
        }
        FilterByValueEdit.prototype.createContents = function (container) {
            var _this = this;
            var opt = new OptionProvider_1.ListOptionProvider();
            opt.addOption({
                type: "BOOLEAN",
                id: "filterByValue_above",
                label: APPMSG.FilterByValueEdit_showAbove,
                value: function () { return _this.filter.showAbove ? true : false; },
                change: function (value) {
                    _this.filter.showAbove = value;
                    _this._emitFieldChanged();
                }
            });
            opt.addOption({
                type: "NUMBER",
                id: "filterByValue_thresholdValue",
                label: APPMSG.FilterByValueEdit_value,
                value: function () { return _this.filter.thresholdValue; },
                change: function (value) {
                    if ($.isNumeric(value)) {
                        var n = value;
                        if (n != _this.filter.thresholdValue) {
                            _this.filter.thresholdValue = n;
                            _this._emitFieldChanged();
                        }
                    }
                }
            });
            this.options = opt;
            var form = $("<form>").appendTo(container);
            var ul = $("<ul>").appendTo(form);
            opt.createWidgets(ul);
            new Form(form, null);
            _super.prototype.createContents.call(this, container);
        };
        FilterByValueEdit.prototype.updateContents = function (filter) {
            this.filter = filter;
            this.options.update();
            _super.prototype.updateContents.call(this, filter);
        };
        return FilterByValueEdit;
    }(FilterPrimaryCounterEdit));
    return FilterByValueEdit;
});

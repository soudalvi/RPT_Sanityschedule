var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Form", "edit/FilterPrimaryCounterEdit", "ui/OptionProvider", "jrptlib/Properties!APPMSG"], function (require, exports, Form, FilterPrimaryCounterEdit, OptionProvider_1, APPMSG) {
    "use strict";
    var FilterByCountEdit = (function (_super) {
        __extends(FilterByCountEdit, _super);
        function FilterByCountEdit(counterDescTree, wildcards) {
            _super.call(this, counterDescTree, wildcards);
        }
        FilterByCountEdit.prototype.createContents = function (container) {
            var _this = this;
            var opt = new OptionProvider_1.ListOptionProvider();
            opt.addOption({
                type: "BOOLEAN",
                id: "filterByCount_Highest",
                label: APPMSG.FilterByCountEdit_showHighest,
                value: function () { return _this.filter.showHighest ? true : false; },
                change: function (value) {
                    _this.filter.showHighest = value;
                    _this._emitFieldChanged();
                }
            });
            opt.addOption({
                type: "NUMBER",
                id: "filterByCount_Count",
                label: APPMSG.FilterByCountEdit_count,
                min: 0,
                step: 1,
                value: function () { return _this.filter.count; },
                change: function (value) {
                    if ($.isNumeric(value)) {
                        var n = parseInt(value);
                        if ($.isNumeric(n)) {
                            if (n < 0)
                                n = 0;
                            if (n != _this.filter.count) {
                                _this.filter.count = n;
                                _this._emitFieldChanged();
                            }
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
        FilterByCountEdit.prototype.updateContents = function (filter) {
            this.filter = filter;
            this.options.update();
            _super.prototype.updateContents.call(this, filter);
        };
        return FilterByCountEdit;
    }(FilterPrimaryCounterEdit));
    return FilterByCountEdit;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Listview"], function (require, exports, Listview) {
    "use strict";
    var CheckboxListview = (function (_super) {
        __extends(CheckboxListview, _super);
        function CheckboxListview(container) {
            _super.call(this, container);
            this._checkedItems = [];
            $(container).addClass("checkboxlistview");
            this.checkStateProvider = null;
            this.allowUncheckAll = true;
        }
        CheckboxListview.prototype.setAllowUncheckAll = function (allow) {
            this.allowUncheckAll = allow;
        };
        CheckboxListview.prototype.isAllowUncheckAll = function () {
            return this.allowUncheckAll;
        };
        CheckboxListview.prototype.setCheckStateProvider = function (checkStateProvider) {
            this.checkStateProvider = checkStateProvider;
        };
        CheckboxListview.prototype.getCheckStateProvider = function () {
            return this.checkStateProvider;
        };
        CheckboxListview.prototype.setDisabled = function (value) {
            _super.prototype.setDisabled.call(this, value);
            $(this.getContainer()).find("input.checkbox_viewitem").prop("disabled", value);
        };
        CheckboxListview.prototype.fillItemContents = function (listitem, data, idx) {
            var _this = this;
            var checkbox = $("<input class=\"checkbox_viewitem\" id=\"checkbox_" + idx + "\" type=\"checkbox\" />")
                .appendTo($(listitem))
                .click(function (e) {
                e.stopPropagation();
                var select = $(this).prop("checked");
                if (select) {
                    _this._checkedItems.push(data);
                }
                else {
                    if (!_this.allowUncheckAll && _this._checkedItems.length == 1) {
                        $(this).prop("checked", true);
                        return;
                    }
                    _this._checkedItems.splice(_this._checkedItems.indexOf(data), 1);
                }
                _this.emit("checked", { item: data, selection: select });
                _this.emit("checkListChanged", _this._checkedItems);
            });
            var label = $("<label for=\"checkbox_" + idx + "\">").appendTo($(listitem));
            $(label).text(this.getLabelProvider().getText(data));
            if (this.checkStateProvider != null) {
                var checked = this.checkStateProvider.isChecked(data);
                $(checkbox).prop("checked", checked);
                if (this._checkedItems.indexOf(data) != -1) {
                    if (!checked) {
                        this._checkedItems.splice(this._checkedItems.indexOf(data), 1);
                    }
                }
                else {
                    if (checked) {
                        this._checkedItems.push(data);
                    }
                }
            }
        };
        CheckboxListview.prototype.updateCheckStateViewItem = function (item, value) {
            var li = this.findViewItem(item);
            if (li != null) {
                $(li).find("input").prop("checked", value);
            }
        };
        CheckboxListview.prototype.setChecked = function (item, value) {
            if (this._checkedItems.indexOf(item) != -1) {
                if (!value) {
                    this._checkedItems.splice(this._checkedItems.indexOf(item), 1);
                    this.updateCheckStateViewItem(item, value);
                }
            }
            else if (value) {
                this._checkedItems.push(item);
                this.updateCheckStateViewItem(item, value);
            }
        };
        CheckboxListview.prototype.getCheckedItems = function () {
            return this._checkedItems;
        };
        return CheckboxListview;
    }(Listview));
    return CheckboxListview;
});

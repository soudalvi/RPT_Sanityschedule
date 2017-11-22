var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/DropDownList"], function (require, exports, DropDownList) {
    "use strict";
    var CheckboxDropDownList = (function (_super) {
        __extends(CheckboxDropDownList, _super);
        function CheckboxDropDownList(container, desc_container) {
            _super.call(this, container, desc_container);
            $(container).addClass("checkboxdropdown-list");
            this.checkStateProvider = null;
            this.allowUncheckAll = true;
        }
        CheckboxDropDownList.prototype.setAllowUncheckAll = function (allow) {
            this.allowUncheckAll = allow;
        };
        CheckboxDropDownList.prototype.isAllowUncheckAll = function () {
            return this.allowUncheckAll;
        };
        CheckboxDropDownList.prototype.setCheckStateProvider = function (checkStateProvider) {
            this.checkStateProvider = checkStateProvider;
        };
        CheckboxDropDownList.prototype.getCheckStateProvider = function () {
            return this.checkStateProvider;
        };
        CheckboxDropDownList.prototype.useCheckboxes = function () {
            return true;
        };
        CheckboxDropDownList.prototype.drawListItem = function (contents_i, item, idx) {
            if (!this.useCheckboxes()) {
                _super.prototype.drawListItem.call(this, contents_i, item, idx);
                return;
            }
            var contents = $("<span>").addClass("label").appendTo($(contents_i));
            var _this = this;
            var checkbox = $("<input id=\"checkbox_" + idx + "\" type=\"checkbox\" />")
                .appendTo($(contents))
                .change(function (e) {
                e.stopPropagation();
                var select = $(this).prop("checked");
                if (select) {
                    _this._checkedItems.push(item);
                }
                else {
                    if (!_this.allowUncheckAll && _this._checkedItems.length == 1) {
                        $(this).prop("checked", true);
                        return;
                    }
                    _this._checkedItems.splice(_this._checkedItems.indexOf(item), 1);
                }
                _this.emit("checked", { item: item, selection: select });
                _this.emit("checkListChanged", _this._checkedItems);
            });
            var label = $("<label for=\"checkbox_" + idx + "\">").appendTo($(contents));
            $(label).text(this.getLabelProvider().getText(item));
            if (this.checkStateProvider != null) {
                var checked = this.checkStateProvider.isChecked(item);
                $(checkbox).prop("checked", checked);
                if (this._checkedItems.indexOf(item) != -1) {
                    if (!checked) {
                        this._checkedItems.splice(this._checkedItems.indexOf(item), 1);
                    }
                }
                else {
                    if (checked) {
                        this._checkedItems.push(item);
                    }
                }
            }
        };
        CheckboxDropDownList.prototype.refreshList = function () {
            this._checkedItems = [];
            _super.prototype.refreshList.call(this);
        };
        CheckboxDropDownList.prototype.select = function (index) {
            this.selection = this.list[index];
            if (!this.useCheckboxes()) {
                this.closeComboList();
            }
            this.emit("selectionChanged", this.selection);
        };
        CheckboxDropDownList.prototype.closeComboList = function () {
            _super.prototype.closeComboList.call(this);
            this._checkedItems = [];
        };
        CheckboxDropDownList.prototype.openComboList = function () {
            this._checkedItems = [];
            _super.prototype.openComboList.call(this);
        };
        CheckboxDropDownList.prototype.updateCheckStateViewItem = function (item, value) {
            if (this.list == null)
                return;
            var li = this.getListViewItem(item);
            if (li != null) {
                $(li).find("input").prop("checked", value);
            }
        };
        CheckboxDropDownList.prototype.setChecked = function (item, value) {
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
        CheckboxDropDownList.prototype.updateCheckState = function () {
            if (this.list == null)
                return;
            for (var i = 0; i < this.list.length; i++) {
                var item = this.list[i];
                this.setChecked(item, this.checkStateProvider.isChecked(item));
            }
        };
        return CheckboxDropDownList;
    }(DropDownList));
    return CheckboxDropDownList;
});

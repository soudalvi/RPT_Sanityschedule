define(["require", "exports"], function (require, exports) {
    "use strict";
    var CategoryValue = (function () {
        function CategoryValue(category, value) {
            this.category = category;
            this.value = value;
            this.enabled = true;
        }
        CategoryValue.prototype._updateSettings = function (filter) {
            this.enabled = filter == null || filter.indexOf(this.value) != -1;
        };
        CategoryValue.prototype.getValue = function () {
            return this.value ? this.value : "Others";
        };
        CategoryValue.prototype.isEnabled = function () {
            return this.enabled;
        };
        CategoryValue.prototype.setEnabled = function (enabled) {
            this.enabled = enabled;
            this.category.applyValuesEnablement();
        };
        CategoryValue.prototype.isOther = function () {
            return !this.value;
        };
        return CategoryValue;
    }());
    return CategoryValue;
});

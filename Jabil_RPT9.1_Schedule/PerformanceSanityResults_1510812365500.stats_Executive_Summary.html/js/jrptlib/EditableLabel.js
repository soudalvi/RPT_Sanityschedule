var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Widget"], function (require, exports, Widget) {
    "use strict";
    var EditableLabel = (function (_super) {
        __extends(EditableLabel, _super);
        function EditableLabel(container) {
            var _this = this;
            _super.call(this, container);
            this.setClassName("ui-editable-label");
            var display_element = $("<div/>");
            var contents = $(container).contents();
            $(container).append($(display_element));
            $(display_element).append($(contents));
            var input_element = $("<input type=\"text\" style=\"display:none\"/>");
            $(container).append($(input_element));
            var old_text = "";
            $(display_element).click(function () {
                if (_this.isDisabled())
                    return;
                old_text = $(display_element).text();
                $(display_element).hide();
                $(input_element).show().val(old_text).focus();
            });
            var terminate_edit = function (input) {
                $(input).hide();
                $(display_element).show();
                if ($(input).val() != "" && $(input).val() != old_text) {
                    _this.emit("textWillChange", $(input).val());
                    $(display_element).text($(input).val());
                    _this.emit("textChanged", $(input).val());
                }
            };
            $(input_element).change(function () {
                terminate_edit(input_element);
            });
            $(input_element).focusout(function () {
                terminate_edit(input_element);
            });
        }
        EditableLabel.prototype.destroy = function () {
            $(this.getContainer()).unbind("click");
            $(this.getContainer()).find("input").remove();
            var text = $(this.getContainer()).find("div").text();
            $(this.getContainer()).text(text);
            _super.prototype.destroy.call(this);
        };
        return EditableLabel;
    }(Widget));
    return EditableLabel;
});

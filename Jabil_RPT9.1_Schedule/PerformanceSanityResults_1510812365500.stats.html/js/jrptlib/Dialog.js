var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented"], function (require, exports, Evented) {
    "use strict";
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog(container, apply_button_text, cancel_button_text, _width) {
            var _this = this;
            _super.call(this);
            this.container = container;
            this.dialog = $(container).appendTo($(document.body))
                .dialog({
                autoOpen: true,
                closeText: cancel_button_text,
                modal: true,
                width: _width ? _width : 300,
                buttons: [
                    {
                        autofocus: "true",
                        id: "apply_button",
                        text: apply_button_text,
                        click: function (e) {
                            _this.emit("apply", $(e.currentTarget));
                        } },
                    {
                        text: cancel_button_text,
                        click: function (e) {
                            if (_this.progressBar)
                                _this.progressBar.hide();
                            _this.emit("cancel", $(e.currentTarget));
                        } }]
            });
        }
        Dialog.prototype.destroy = function () {
            $(this.dialog).dialog('destroy').remove();
        };
        Dialog.prototype.getProgressBar = function (customLabel) {
            if (this.progressBar)
                return this.progressBar;
            if (customLabel)
                $("<div id=\"progressbar\"><div class=\"progress-label\">" + customLabel + "</div></div>")
                    .appendTo($(this.container));
            else
                $("<div id=\"progressbar\"></div>").appendTo($(this.container));
            this.progressBar = $(this.dialog).find("#progressbar");
            this.progressLabel = $(this.dialog).find(".progress-label");
            this.progressBar.progressbar();
            this.progressBar.hide();
            return this.progressBar;
        };
        Dialog.prototype.getDialog = function () {
            return this.dialog;
        };
        Dialog.prototype.open = function () {
            $(this.dialog).dialog("open");
            this.emit("opened", {});
        };
        Dialog.prototype.close = function () {
            $(this.dialog).dialog("close");
            this.emit("closed", {});
        };
        return Dialog;
    }(Evented));
    return Dialog;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    var MessageDialog = (function () {
        function MessageDialog() {
        }
        MessageDialog.openError = function (message, close_button_text) {
            $("#error_dialog").empty();
            var p = $("<p>").text(message).appendTo($("#error_dialog"));
            $(p).prepend("<span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin:0 7px 20px 0;\"></span>");
            var error_dialog = $("#error_dialog").dialog({
                autoOpen: false,
                closeText: close_button_text ? close_button_text : "Close",
                modal: true,
                dialogClass: "error-dialog",
                buttons: [{
                        text: close_button_text ? close_button_text : "Close",
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
            setTimeout(function () {
                error_dialog.dialog("open");
            }, 200);
            return error_dialog;
        };
        return MessageDialog;
    }());
    return MessageDialog;
});

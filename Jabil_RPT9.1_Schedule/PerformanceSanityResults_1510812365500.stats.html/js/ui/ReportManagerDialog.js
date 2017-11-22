var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jrptlib/Evented", "jrptlib/Listview", "jrptlib/Properties!APPMSG", "ui/HelpContextIds"], function (require, exports, Evented, Listview, APPMSG, HelpContextIds) {
    "use strict";
    var ReportManagerDialog = (function (_super) {
        __extends(ReportManagerDialog, _super);
        function ReportManagerDialog() {
            var _this = this;
            _super.call(this);
            this.dialog = $("#report_manager_dialog").dialog({
                autoOpen: false,
                height: 450,
                closeText: APPMSG.Close_button,
                modal: true,
                dialogClass: "report-manager-dialog",
                buttons: [{
                        text: APPMSG.Close_button,
                        click: function () {
                            $(_this.dialog).dialog("close");
                        } }],
                resize: function (event, ui) {
                    $(_this.report_list.getContainer()).width(ui.size.width - $(colbut).width() - 50);
                },
                resizeStop: function (event, ui) {
                    $(_this.report_list.getContainer()).width(ui.size.width - $(colbut).width() - 50);
                }
            });
            var colbut = $(this.dialog).find(".button-column");
            var b_default = $(this.dialog).find("#report_manager_dialog_default_button")
                .button({
                label: APPMSG.RestoreReport
            })
                .click(function (e) {
                _this.restoreDefaultReport(APPMSG.ReportManagerDialog_ConfirmRestore_message);
            });
            var b_delete = $(this.dialog).find("#report_manager_dialog_delete_button")
                .button({
                label: APPMSG.RemoveReport
            })
                .click(function (e) {
                _this.deleteReport();
            });
            this.report_list = new Listview($(this.dialog).find(".report-list")[0]);
            this.report_list.setLabelProvider({
                getText: function (object) {
                    return $(object).attr("label");
                }
            });
            this.report_list.setContentProvider({
                getElements: function (object, handler) {
                    handler(_this.list);
                }
            });
            this.report_list.on("selectionChanged", function (selection) {
                var is_default = $(selection).attr("isDefault") === "true";
                var is_user = $(selection).attr("isDefault") === "false";
                if (is_default) {
                    $(b_delete).button("disable");
                    $(b_default).button("enable");
                }
                if (is_user) {
                    $(b_delete).button("enable");
                    $(b_default).button("disable");
                }
            });
            _app.getHelpSystem().setHelp(".report-manager-dialog", HelpContextIds.REPORT_MANAGER_DIALOG);
        }
        ReportManagerDialog.prototype.open = function () {
            this.dialog.dialog("open");
            var colbut = $(this.dialog).find(".button-column");
            this.dialog.dialog("option", "width", $(this.report_list.getContainer()).width() + colbut.width() + 50);
            this.report_list.setInput(this.list);
            if (this.list.length > 0) {
                this.report_list.setSelection(this.list[0]);
            }
        };
        ReportManagerDialog.prototype.setReports = function (report_kind, reports) {
            this.report_kind = report_kind;
            this.list = reports.slice(0);
        };
        ReportManagerDialog.prototype.restoreDefaultReport = function (confirmMessage) {
            var _this = this;
            $("#app_dialog_confirm").find(".ui-dialog-message").text(confirmMessage);
            var dialog = $("#app_dialog_confirm").dialog({
                resizable: true,
                modal: true,
                closeText: APPMSG.Close_button,
                title: APPMSG.ReportManagerDialog_ConfirmDialog_title,
                buttons: [{
                        text: APPMSG.ReportManagerDialog_ConfirmButton,
                        click: function () {
                            $(dialog).dialog("close");
                            var report = _this.report_list.getSelection();
                            $.ajax({
                                url: "/analytics/reports/" + _this.report_kind + "/" + $(report).attr("id"),
                                type: 'DELETE',
                                success: function (result) {
                                    _this.list.splice(_this.list.indexOf(report), 1);
                                    _this.report_list.update();
                                    _this.emit("removed", $(report).attr("id"));
                                }
                            });
                        } }, {
                        text: APPMSG.Cancel_button,
                        click: function () {
                            $(this).dialog("close");
                        } }]
            });
        };
        ReportManagerDialog.prototype.deleteReport = function () {
            this.restoreDefaultReport(APPMSG.ReportManagerDialog_ConfirmDelete_message);
        };
        return ReportManagerDialog;
    }(Evented));
    return ReportManagerDialog;
});
